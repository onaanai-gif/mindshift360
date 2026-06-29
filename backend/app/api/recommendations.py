from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.business_profile import BusinessProfile
from app.models.daily_recommendation_progress import DailyRecommendationProgress
from app.schemas.daily_recommendation_progress import (
    DailyRecommendationProgressCreate,
    DailyRecommendationProgressRead,
)

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("/progress", response_model=DailyRecommendationProgressRead, status_code=201)
def create_recommendation_progress(
    payload: DailyRecommendationProgressCreate, db: Session = Depends(get_db)
) -> DailyRecommendationProgress:
    """Save a business owner's response to a daily recommendation."""
    profile = db.get(BusinessProfile, payload.business_profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")

    progress = DailyRecommendationProgress(
        business_profile_id=payload.business_profile_id,
        recommendation_key=payload.recommendation_key,
        status=payload.status.value,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
