from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DailyRecommendationProgress(Base):
    """A single record of a business owner's response to a daily recommendation."""

    __tablename__ = "daily_recommendation_progress"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_profile_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("business_profiles.id"), nullable=False
    )
    recommendation_key: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
