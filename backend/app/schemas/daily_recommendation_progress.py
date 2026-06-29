from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict


class RecommendationStatus(StrEnum):
    COMPLETED = "completed"
    LATER = "later"
    NEED_HELP = "need_help"
    NEED_HELP_ATTEMPT = "need_help_attempt"


class DailyRecommendationProgressCreate(BaseModel):
    business_profile_id: int
    recommendation_key: str
    status: str


class DailyRecommendationProgressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    business_profile_id: int
    recommendation_key: str
    status: str
    created_at: datetime
    updated_at: datetime


class RecommendationHistoryItem(BaseModel):
    title: str
    status: str
    created_at: datetime
