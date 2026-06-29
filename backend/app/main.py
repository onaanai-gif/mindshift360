from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.business import router as business_router
from app.api.health import router as health_router
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(business_router)
