from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, field_validator


class PrimaryGoal(StrEnum):
    GET_MORE_CUSTOMERS = "Get More Customers"
    INCREASE_SALES = "Increase Sales"
    IMPROVE_CUSTOMER_SERVICE = "Improve Customer Service"
    ORGANISE_MY_BUSINESS = "Organise My Business"


def _required_text(value: str, field_name: str) -> str:
    trimmed = value.strip()
    if not trimmed:
        raise ValueError(f"{field_name} must not be empty")
    return trimmed


class BusinessProfileCreate(BaseModel):
    business_name: str
    business_type: str
    town_city: str
    primary_goal: PrimaryGoal

    @field_validator("business_name")
    @classmethod
    def validate_business_name(cls, value: str) -> str:
        return _required_text(value, "business_name")

    @field_validator("business_type")
    @classmethod
    def validate_business_type(cls, value: str) -> str:
        return _required_text(value, "business_type")

    @field_validator("town_city")
    @classmethod
    def validate_town_city(cls, value: str) -> str:
        return _required_text(value, "town_city")


class BusinessProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    business_name: str
    business_type: str
    town_city: str
    primary_goal: str
    created_at: datetime
    updated_at: datetime


class LatestBusinessProfileRead(BaseModel):
    id: int
    business_name: str
    business_type: str
    town_city: str
    primary_goal: str
    created_at: datetime
    updated_at: datetime
    latest_recommendation_status: str | None
    last_updated: datetime
