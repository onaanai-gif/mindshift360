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
