import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """Configure root logging with a consistent, structured format."""
    logging.basicConfig(
        level=settings.log_level,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        stream=sys.stdout,
    )
