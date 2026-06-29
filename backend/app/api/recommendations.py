from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.business_profile import BusinessProfile
from app.models.daily_recommendation_progress import DailyRecommendationProgress
from app.schemas.daily_recommendation_progress import (
    DailyRecommendationProgressCreate,
    DailyRecommendationProgressRead,
    RecommendationHistoryItem,
    RecommendationStatus,
)

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

VALID_STATUSES = {status.value for status in RecommendationStatus}

RECOMMENDATION_TITLES: dict[str, str] = {
    "get_more_customers": "Help More People Find Your Business",
    "increase_sales": "Make Buying Easier",
    "improve_customer_service": "Improve Customer Experience",
    "organise_my_business": "Organise Your Daily Work",
}


@router.get("/history/{profile_id}", response_model=list[RecommendationHistoryItem])
def get_recommendation_history(
    profile_id: int, db: Session = Depends(get_db)
) -> list[RecommendationHistoryItem]:
    """Return all recommendation progress records for a profile, newest first."""
    profile = db.get(BusinessProfile, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")

    records = (
        db.query(DailyRecommendationProgress)
        .filter(DailyRecommendationProgress.business_profile_id == profile_id)
        .order_by(DailyRecommendationProgress.id.desc())
        .all()
    )

    return [
        RecommendationHistoryItem(
            title=RECOMMENDATION_TITLES.get(r.recommendation_key, r.recommendation_key),
            status=r.status,
            created_at=r.created_at,
        )
        for r in records
    ]


@router.post("/progress", response_model=DailyRecommendationProgressRead, status_code=201)
def create_recommendation_progress(
    payload: DailyRecommendationProgressCreate, db: Session = Depends(get_db)
) -> DailyRecommendationProgress:
    """Save a business owner's response to a daily recommendation."""
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status value")

    profile = db.get(BusinessProfile, payload.business_profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")

    progress = DailyRecommendationProgress(
        business_profile_id=payload.business_profile_id,
        recommendation_key=payload.recommendation_key,
        status=payload.status,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
