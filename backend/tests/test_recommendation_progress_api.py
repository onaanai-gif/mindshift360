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


def test_create_recommendation_progress_invalid_status_returns_400(client: TestClient) -> None:
    profile_id = _create_profile(client)

    response = client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "get_more_customers",
            "status": "not_a_real_status",
        },
    )

    assert response.status_code == 400


def test_create_recommendation_progress_need_help_attempt_status_succeeds(
    client: TestClient,
) -> None:
    profile_id = _create_profile(client)

    response = client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "get_more_customers",
            "status": "need_help_attempt",
        },
    )

    assert response.status_code == 201
    assert response.json()["status"] == "need_help_attempt"


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


def test_get_recommendation_history_returns_404_for_unknown_profile(client: TestClient) -> None:
    response = client.get("/api/recommendations/history/999999")

    assert response.status_code == 404


def test_get_recommendation_history_returns_empty_list_when_no_progress(
    client: TestClient,
) -> None:
    profile_id = _create_profile(client)

    response = client.get(f"/api/recommendations/history/{profile_id}")

    assert response.status_code == 200
    assert response.json() == []


def test_get_recommendation_history_returns_records_newest_first(client: TestClient) -> None:
    profile_id = _create_profile(client)
    client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "get_more_customers",
            "status": "later",
        },
    )
    client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "increase_sales",
            "status": "completed",
        },
    )

    response = client.get(f"/api/recommendations/history/{profile_id}")

    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    assert items[0]["title"] == "Make Buying Easier"
    assert items[0]["status"] == "completed"
    assert items[1]["title"] == "Help More People Find Your Business"
    assert items[1]["status"] == "later"
    assert "created_at" in items[0]


def test_get_recommendation_history_maps_key_to_title(client: TestClient) -> None:
    profile_id = _create_profile(client)
    client.post(
        "/api/recommendations/progress",
        json={
            "business_profile_id": profile_id,
            "recommendation_key": "organise_my_business",
            "status": "need_help_attempt",
        },
    )

    response = client.get(f"/api/recommendations/history/{profile_id}")

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Organise Your Daily Work"


def test_get_latest_business_profile_includes_progress_counts(client: TestClient) -> None:
    profile_id = _create_profile(client)
    for status in ["completed", "completed", "later", "need_help_attempt"]:
        client.post(
            "/api/recommendations/progress",
            json={
                "business_profile_id": profile_id,
                "recommendation_key": "get_more_customers",
                "status": status,
            },
        )

    response = client.get("/api/business/profile/latest")

    assert response.status_code == 200
    body = response.json()
    assert body["recommendations_completed"] == 2
    assert body["recommendations_later"] == 1
    assert body["recommendations_need_help"] == 1
