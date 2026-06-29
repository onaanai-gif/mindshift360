from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration sourced from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "MINDSHIFT360 Business Growth Partner"
    environment: str = "development"
    log_level: str = "INFO"

    database_url: str = "postgresql+psycopg2://postgres:postgres@db:5432/mindshift360"

    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
