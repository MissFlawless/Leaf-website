"""Tests for normal, benign content moderation."""
import pytest
from moderation_agent.agent import ModerationAgent
from moderation_agent.models import ModerationStatus


@pytest.fixture
def agent():
    return ModerationAgent()


def test_benign_reader_comments(agent):
    comments = [
        "I loved this chapter! The character development of Kira is amazing.",
        "Can't wait to see what happens in chapter 3! Keep up the wonderful work.",
        "Such a poignant and beautiful scene by the lake.",
        "Thank you for writing this, it made my evening.",
        "Interesting plot twist! I did not see that coming at all.",
    ]
    for text in comments:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.APPROVED.value
        assert result.is_approved
        assert not result.is_flagged
        assert not result.requires_review
        assert len(result.categories) == 0


def test_benign_chapter_content(agent):
    title = "Chapter 1: The First Frost"
    content = """
    <p>The dawn broke over the mountains, painting the pines in pale silver frost.</p>
    <p>Elena tightened her woolen cloak and stepped outside the wooden gate. Today was the gathering.</p>
    <p>She whispered a prayer for good fortune and walked down the cobblestone road.</p>
    """
    result = agent.check_chapter(title, content)
    assert result.status == ModerationStatus.APPROVED.value
    assert result.is_approved
    assert not result.is_flagged


def test_constructive_critique_is_approved(agent):
    critique = "The pacing in the second scene felt a bit rushed, but overall the dialogue was great!"
    result = agent.check_comment(critique)
    assert result.status == ModerationStatus.APPROVED.value
