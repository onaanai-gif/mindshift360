import os
import subprocess
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect

BACKEND_ROOT = Path(__file__).resolve().parent.parent

EXPECTED_COLUMNS = {
    "id",
    "business_name",
    "business_type",
    "town_city",
    "primary_goal",
    "created_at",
    "updated_at",
}

EXPECTED_PROGRESS_COLUMNS = {
    "id",
    "business_profile_id",
    "recommendation_key",
    "status",
    "created_at",
    "updated_at",
}


def test_alembic_upgrade_creates_business_profiles_table(tmp_path: Path) -> None:
    db_path = tmp_path / "migration_test.db"
    database_url = f"sqlite:///{db_path}"

    env = {**os.environ, "DATABASE_URL": database_url}
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND_ROOT,
        env=env,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr

    engine = create_engine(database_url)
    inspector = inspect(engine)

    assert "business_profiles" in inspector.get_table_names()
    columns = {column["name"] for column in inspector.get_columns("business_profiles")}
    assert columns == EXPECTED_COLUMNS

    assert "daily_recommendation_progress" in inspector.get_table_names()
    progress_columns = {
        column["name"] for column in inspector.get_columns("daily_recommendation_progress")
    }
    assert progress_columns == EXPECTED_PROGRESS_COLUMNS

    engine.dispose()
