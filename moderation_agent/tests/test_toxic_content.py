"""Tests for toxic, abusive, and harassing content moderation."""
import pytest
from moderation_agent.agent import ModerationAgent
from moderation_agent.models import ModerationCategory, ModerationStatus


@pytest.fixture
def agent():
    return ModerationAgent()


def test_violent_threats_flagged(agent):
    threats = [
        "I will find you and kill you for writing this",
        "i'll murder you you piece of trash",
        "You should die in a fire",
    ]
    for text in threats:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged
        assert ModerationCategory.TOXICITY.value in result.categories or ModerationCategory.HARASSMENT.value in result.categories
        assert len(result.reason) > 0


def test_self_harm_encouragement_flagged(agent):
    encouragements = [
        "just kys already",
        "kill yourself nobody cares about your writing",
    ]
    for text in encouragements:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged


def test_hate_speech_and_slurs_flagged(agent):
    slurs = [
        "you disgusting subhuman",
        "only a retard would like this story",
    ]
    for text in slurs:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged
        assert len(result.flagged_terms) > 0


def test_toxic_chapter_content_flagged(agent):
    title = "Cruel Manifesto"
    content = "<p>You are all subhuman scum of the earth and you will die in a fire.</p>"
    result = agent.check_chapter(title, content)
    assert result.status == ModerationStatus.FLAGGED.value
    assert result.is_flagged
