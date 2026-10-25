"""Tests for borderline content requiring human review."""
import pytest
from moderation_agent.agent import ModerationAgent
from moderation_agent.models import ModerationCategory, ModerationStatus


@pytest.fixture
def agent():
    return ModerationAgent()


def test_mildly_hostile_insults_require_review(agent):
    borderline_samples = [
        "This author is an idiot, what a dumb plot.",
        "Your story is trash, delete this chapter immediately.",
        "Stop writing, you clown.",
    ]
    for text in borderline_samples:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.NEEDS_REVIEW.value
        assert result.requires_review
        assert not result.is_approved
        assert not result.is_flagged
        assert ModerationCategory.INAPPROPRIATE.value in result.categories


def test_profanity_in_comments_requires_review(agent):
    samples = [
        "What the wtf happened to the main character in this chapter?",
        "This shit story makes no sense to me.",
    ]
    for text in samples:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.NEEDS_REVIEW.value
        assert result.requires_review


def test_distress_and_sensitive_mentions_require_review(agent):
    distress_text = "I feel depressed reading this, feel like giving up on everything."
    result = agent.check_comment(distress_text)
    assert result.status == ModerationStatus.NEEDS_REVIEW.value
    assert result.requires_review
