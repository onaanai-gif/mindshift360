from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["health"])
def get_health() -> dict[str, str]:
    """Liveness/readiness probe for the API."""
    return {"status": "ok"}
