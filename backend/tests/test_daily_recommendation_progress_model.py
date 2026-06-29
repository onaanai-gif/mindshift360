from sqlalchemy.orm import Session

from app.models.business_profile import BusinessProfile
from app.models.daily_recommendation_progress import DailyRecommendationProgress


def test_daily_recommendation_progress_persists_and_sets_timestamps(db_session: Session) -> None:
    profile = BusinessProfile(
        business_name="Acme Bakery",
        business_type="Bakery",
        town_city="Lagos",
        primary_goal="Get More Customers",
    )
    db_session.add(profile)
    db_session.commit()
    db_session.refresh(profile)

    progress = DailyRecommendationProgress(
        business_profile_id=profile.id,
        recommendation_key="get_more_customers",
        status="completed",
    )

    db_session.add(progress)
    db_session.commit()
    db_session.refresh(progress)

    assert progress.id is not None
    assert progress.business_profile_id == profile.id
    assert progress.created_at is not None
    assert progress.updated_at is not None


def test_each_button_click_creates_a_new_record(db_session: Session) -> None:
    profile = BusinessProfile(
        business_name="Acme Bakery",
        business_type="Bakery",
        town_city="Lagos",
        primary_goal="Get More Customers",
    )
    db_session.add(profile)
    db_session.commit()
    db_session.refresh(profile)

    first = DailyRecommendationProgress(
        business_profile_id=profile.id,
        recommendation_key="get_more_customers",
        status="later",
    )
    second = DailyRecommendationProgress(
        business_profile_id=profile.id,
        recommendation_key="get_more_customers",
        status="completed",
    )
    db_session.add_all([first, second])
    db_session.commit()

    assert first.id != second.id
