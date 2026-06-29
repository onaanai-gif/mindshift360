from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.business_profile import BusinessProfile
from app.schemas.business_profile import BusinessProfileCreate, BusinessProfileRead

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


@router.get("/profile/{profile_id}", response_model=BusinessProfileRead)
def get_business_profile(profile_id: int, db: Session = Depends(get_db)) -> BusinessProfile:
    """Retrieve a previously saved business profile."""
    profile = db.get(BusinessProfile, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Business profile not found")
    return profile
