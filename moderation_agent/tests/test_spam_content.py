"""Tests for spam, scam, and promotional content moderation."""
import pytest
from moderation_agent.agent import ModerationAgent
from moderation_agent.models import ModerationCategory, ModerationStatus


@pytest.fixture
def agent():
    return ModerationAgent()


def test_crypto_financial_scams_flagged(agent):
    scams = [
        "Earn $5,000 a day easily with our new method!",
        "Join our free crypto giveaway before it ends",
        "Exclusive airdrop token launch! Double your money.",
    ]
    for text in scams:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged
        assert ModerationCategory.SPAM.value in result.categories


def test_social_media_manipulation_spam(agent):
    spam_comments = [
        "Buy cheap followers and likes right now at lowest price",
        "Buy followers to boost your account instantly",
    ]
    for text in spam_comments:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged
        assert ModerationCategory.SPAM.value in result.categories


def test_suspicious_messaging_and_links(agent):
    link_spam = [
        "Contact me for business on whatsapp: +12345678901",
        "Check this out: https://bit.ly/free-bonus-claim",
        "Click here to claim free gift cards right now",
    ]
    for text in link_spam:
        result = agent.check_comment(text)
        assert result.status == ModerationStatus.FLAGGED.value
        assert result.is_flagged


def test_repetitive_character_gibberish(agent):
    gibberish = "read this aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    result = agent.check_comment(gibberish)
    assert result.status == ModerationStatus.FLAGGED.value
    assert result.is_flagged
