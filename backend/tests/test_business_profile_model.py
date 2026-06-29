from sqlalchemy.orm import Session

from app.models.business_profile import BusinessProfile


def test_business_profile_persists_and_sets_timestamps(db_session: Session) -> None:
    profile = BusinessProfile(
        business_name="Acme Bakery",
        business_type="Bakery",
        town_city="Lagos",
        primary_goal="Get More Customers",
    )

    db_session.add(profile)
    db_session.commit()
    db_session.refresh(profile)

    assert profile.id is not None
    assert profile.created_at is not None
    assert profile.updated_at is not None
