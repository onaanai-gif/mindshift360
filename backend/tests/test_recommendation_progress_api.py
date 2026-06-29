from fastapi.testclient import TestClient

PROFILE_PAYLOAD = {
    "business_name": "Acme Bakery",
    "business_type": "Bakery",
    "town_city": "Lagos",
    "primary_goal": "Get More Customers",
}


def _create_profile(client: TestClient) -> int:
    response = client.post("/api/business/profile", json=PROFILE_PAYLOAD)
    return response.json()["id"]


def test_create_recommendation_progress_success(client: TestClient) -> None:
    profile_id = _create_profile(client)

    response = client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "get_more_customers",
            "status": "completed",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["business_profile_id"] == profile_id
    assert body["recommendation_key"] == "get_more_customers"
    assert body["status"] == "completed"
    assert "id" in body
    assert "created_at" in body
    assert "updated_at" in body


def test_create_recommendation_progress_does_not_overwrite_previous_records(
    client: TestClient,
) -> None:
    profile_id = _create_profile(client)
    payload = {
        "business_profile_id": profile_id,
        "recommendation_key": "get_more_customers",
        "status": "later",
    }

    first = client.post("/api/recommendations/progress", json=payload)
    second = client.post("/api/recommendations/progress", json=payload)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["id"] != second.json()["id"]


def test_create_recommendation_progress_invalid_status_returns_422(client: TestClient) -> None:
    profile_id = _create_profile(client)

    response = client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "get_more_customers",
            "status": "not_a_real_status",
        },
    )

    assert response.status_code == 422


def test_create_recommendation_progress_missing_profile_returns_404(client: TestClient) -> None:
    response = client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": 999999,
            "recommendation_key": "get_more_customers",
            "status": "completed",
        },
    )

    assert response.status_code == 404
