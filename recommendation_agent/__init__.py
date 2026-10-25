"""Standalone, framework-agnostic story recommendation package."""

from .agent import RecommendationAgent
from .models import Recommendation, SearchResult, Story

__all__ = ["RecommendationAgent", "Recommendation", "SearchResult", "Story"]
