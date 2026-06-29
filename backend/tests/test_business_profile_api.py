from fastapi.testclient import TestClient

VALID_PAYLOAD = {
    "business_name": "Acme Bakery",
    "business_type": "Bakery",
    "town_city": "Lagos",
    "primary_goal": "Get More Customers",
}


def test_create_business_profile_success(client: TestClient) -> None:
    response = client.post("/api/business/profile", json=VALID_PAYLOAD)

    assert response.status_code == 201
    body = response.json()
    assert body["business_name"] == "Acme Bakery"
    assert body["business_type"] == "Bakery"
    assert body["town_city"] == "Lagos"
    assert body["primary_goal"] == "Get More Customers"
    assert "id" in body
    assert "created_at" in body
    assert "updated_at" in body


def test_create_business_profile_trims_whitespace(client: TestClient) -> None:
    payload = {
        **VALID_PAYLOAD,
        "business_name": "  Acme Bakery  ",
        "town_city": "  Lagos  ",
    }

    response = client.post("/api/business/profile", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body["business_name"] == "Acme Bakery"
    assert body["town_city"] == "Lagos"


def test_create_business_profile_missing_field_returns_422(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD}
    del payload["business_name"]

    response = client.post("/api/business/profile", json=payload)

    assert response.status_code == 422


def test_create_business_profile_empty_string_returns_422(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "business_name": "   "}

    response = client.post("/api/business/profile", json=payload)

    assert response.status_code == 422


def test_create_business_profile_invalid_goal_returns_422(client: TestClient) -> None:
    payload = {**VALID_PAYLOAD, "primary_goal": "Take Over The World"}

    response = client.post("/api/business/profile", json=payload)

    assert response.status_code == 422


def test_get_business_profile_returns_saved_profile(client: TestClient) -> None:
    created = client.post("/api/business/profile", json=VALID_PAYLOAD).json()

    response = client.get(f"/api/business/profile/{created['id']}")

    assert response.status_code == 200
    body = response.json()
    assert body == created


def test_get_business_profile_returns_404_when_missing(client: TestClient) -> None:
    response = client.get("/api/business/profile/999999")

    assert response.status_code == 404


def test_get_latest_business_profile_returns_404_when_none_exists(client: TestClient) -> None:
    response = client.get("/api/business/profile/latest")

    assert response.status_code == 404


def test_get_latest_business_profile_returns_most_recent_profile(client: TestClient) -> None:
    client.post("/api/business/profile", json=VALID_PAYLOAD)
    second = client.post(
        "/api/business/profile",
        json={**VALID_PAYLOAD, "business_name": "Second Bakery"},
    ).json()

    response = client.get("/api/business/profile/latest")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == second["id"]
    assert body["business_name"] == "Second Bakery"
    assert body["latest_recommendation_status"] is None


def test_get_latest_business_profile_returns_latest_recommendation_status(
    client: TestClient,
) -> None:
    profile = client.post("/api/business/profile", json=VALID_PAYLOAD).json()
    client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile["id"],
            "recommendation_key": "get_more_customers",
            "status": "later",
        },
    )
    client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile["id"],
            "recommendation_key": "get_more_customers",
            "status": "need_help_attempt",
        },
    )

    response = client.get("/api/business/profile/latest")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == profile["id"]
    assert body["latest_recommendation_status"] == "need_help_attempt"
