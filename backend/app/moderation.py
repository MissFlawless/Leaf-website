"""Moderation service integration for the Leaf backend."""
from __future__ import annotations

import logging
from pathlib import Path
import sys
from typing import Optional

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from moderation_agent.agent import ModerationAgent
from moderation_agent.config import ModerationConfig

log = logging.getLogger(__name__)


class ModerationService:
    def __init__(self, config: Optional[ModerationConfig] = None):
        self.config = config or ModerationConfig()
        self.agent = ModerationAgent(self.config)


def get_moderation_service() -> ModerationService:
    from flask import current_app
    service = current_app.extensions.get("moderation")
    if not service:
        service = ModerationService()
        current_app.extensions["moderation"] = service
    return service


def initialize_moderation(app):
    """Register moderation service on app startup."""
    try:
        app.extensions["moderation"] = ModerationService()
        log.info("Moderation agent initialized.")
    except Exception as e:
        log.warning("Failed to initialize moderation agent: %s", e)
