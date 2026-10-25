"""Tests for provider failure and fallback behavior in moderation agent."""
from unittest.mock import MagicMock, patch
import pytest

from moderation_agent.agent import ModerationAgent
from moderation_agent.config import ModerationConfig
from moderation_agent.llm_classifier import LLMModerationClassifier
from moderation_agent.models import ModerationResult, ModerationStatus


def test_provider_network_error_falls_back_to_rules():
    classifier = LLMModerationClassifier()
    # Mock classifier.is_available() to True and classify() to fail
    with patch.object(classifier, "is_available", return_value=True), \
         patch.object(classifier, "classify", return_value=None):

        agent = ModerationAgent(classifier=classifier)

        # Benign comment should fall back and be approved
        clean_res = agent.check_comment("A lovely story about gardening.")
        assert clean_res.is_approved
        assert clean_res.source == "fallback"

        # Toxic comment should fall back and be flagged by rules
        toxic_res = agent.check_comment("kill yourself right now")
        assert toxic_res.is_flagged
        assert toxic_res.source == "rules"


def test_provider_exception_handling():
    classifier = LLMModerationClassifier()
    with patch.object(classifier, "is_available", return_value=True), \
         patch.object(classifier, "classify", side_effect=RuntimeError("Connection timed out")):

        agent = ModerationAgent(classifier=classifier)
        try:
            res = agent.check_comment("Hello this is a comment")
        except RuntimeError:
            pytest.fail("ModerationAgent should catch provider exceptions and fall back gracefully.")


def test_provider_invalid_json_handling():
    classifier = LLMModerationClassifier(ModerationConfig(llm_model="gemini-test"))
    with patch("moderation_agent.llm_classifier.get_moderation_llm_api_key", return_value="fake_key"), \
         patch("urllib.request.urlopen") as mock_urlopen:

        # Mock an invalid response body
        mock_response = MagicMock()
        mock_response.read.return_value = b'{"choices": [{"message": {"content": "This is not json"}}]}'
        mock_urlopen.return_value.__enter__.return_value = mock_response

        res = classifier.classify("Some text")
        assert res is None  # Graceful failure returning None to trigger fallback


def test_provider_successful_llm_classification():
    classifier = LLMModerationClassifier(ModerationConfig(llm_model="gemini-test"))
    with patch("moderation_agent.llm_classifier.get_moderation_llm_api_key", return_value="fake_key"), \
         patch("urllib.request.urlopen") as mock_urlopen:

        mock_response = MagicMock()
        mock_response.read.return_value = b'{"choices": [{"message": {"content": "{\\"status\\": \\"flagged\\", \\"categories\\": [\\"spam\\"], \\"confidence\\": 0.99, \\"reason\\": \\"commercial spam\\"}"}}]}'
        mock_urlopen.return_value.__enter__.return_value = mock_response

        agent = ModerationAgent(classifier=classifier)
        res = agent.check_comment("Subtle spam text")
        assert res.is_flagged
        assert res.source == "llm"
        assert "spam" in res.categories
