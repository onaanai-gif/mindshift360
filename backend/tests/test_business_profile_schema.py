import pytest
from pydantic import ValidationError

from app.schemas.business_profile import BusinessProfileCreate, PrimaryGoal

VALID_DATA = {
    "business_name": "Acme Bakery",
    "business_type": "Bakery",
    "town_city": "Lagos",
    "primary_goal": "Get More Customers",
}


def test_valid_payload_parses() -> None:
    profile = BusinessProfileCreate(**VALID_DATA)

    assert profile.business_name == "Acme Bakery"
    assert profile.primary_goal == PrimaryGoal.GET_MORE_CUSTOMERS


@pytest.mark.parametrize("field", ["business_name", "business_type", "town_city"])
def test_blank_required_field_is_rejected(field: str) -> None:
    data = {**VALID_DATA, field: "   "}

    with pytest.raises(ValidationError):
        BusinessProfileCreate(**data)


@pytest.mark.parametrize("field", ["business_name", "business_type", "town_city", "primary_goal"])
def test_missing_required_field_is_rejected(field: str) -> None:
    data = {**VALID_DATA}
    del data[field]

    with pytest.raises(ValidationError):
        BusinessProfileCreate(**data)


def test_whitespace_is_trimmed() -> None:
    data = {**VALID_DATA, "business_name": "  Acme Bakery  "}

    profile = BusinessProfileCreate(**data)

    assert profile.business_name == "Acme Bakery"


def test_invalid_primary_goal_is_rejected() -> None:
    data = {**VALID_DATA, "primary_goal": "Not A Real Goal"}

    with pytest.raises(ValidationError):
        BusinessProfileCreate(**data)
