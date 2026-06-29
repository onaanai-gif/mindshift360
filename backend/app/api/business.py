from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.business_profile import BusinessProfile
from app.models.daily_recommendation_progress import DailyRecommendationProgress
from app.schemas.business_profile import (
    BusinessProfileCreate,
    BusinessProfileRead,
    LatestBusinessProfileRead,
)

router = APIRouter(prefix="/api/business", tags=["business"])


@router.post("/profile", response_model=BusinessProfileRead, status_code=201)
def create_business_profile(
    payload: BusinessProfileCreate, db: Session = Depends(get_db)
) -> BusinessProfile:
    """Save a first-time business owner's introductory profile."""
    profile = BusinessProfile(
        business_name=payload.business_name,
        business_type=payload.business_type,
        town_city=payload.town_city,
        primary_goal=payload.primary_goal.value,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile/latest", response_model=LatestBusinessProfileRead)
def get_latest_business_profile(db: Session = Depends(get_db)) -> LatestBusinessProfileRead:
    """Retrieve the most recently created business profile, for resuming a session."""
    profile = db.query(BusinessProfile).order_by(BusinessProfile.id.desc()).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="No business profile found")

    all_progress = (
        db.query(DailyRecommendationProgress)
        .filter(DailyRecommendationProgress.business_profile_id == profile.id)
        .order_by(DailyRecommendationProgress.id.desc())
        .all()
    )

    latest_progress = all_progress[0] if all_progress else None

    return LatestBusinessProfileRead(
        id=profile.id,
        business_name=profile.business_name,
        business_type=profile.business_type,
        town_city=profile.town_city,
        primary_goal=profile.primary_goal,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        latest_recommendation_status=latest_progress.status if latest_progress else None,
        last_updated=latest_progress.updated_at if latest_progress else profile.updated_at,
        recommendations_completed=sum(1 for p in all_progress if p.status == "completed"),
        recommendations_need_help=sum(1 for p in all_progress if p.status == "need_help_attempt"),
        recommendations_later=sum(1 for p in all_progress if p.status == "later"),
    )


@router.get("/profile/{profile_id}", response_model=BusinessProfileRead)
def get_business_profile(profile_id: int, db: Session = Depends(get_db)) -> BusinessProfile:
    """Retrieve a previously saved business profile."""
    profile = db.get(BusinessProfile, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile
