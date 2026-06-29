from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BusinessProfile(Base):
    """A business owner's introductory profile."""

    __tablename__ = "business_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_name: Mapped[str] = mapped_column(String(200), nullable=False)
    business_type: Mapped[str] = mapped_column(String(200), nullable=False)
    town_city: Mapped[str] = mapped_column(String(200), nullable=False)
    primary_goal: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
