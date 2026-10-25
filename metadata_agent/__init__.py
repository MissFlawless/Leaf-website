"""Story Metadata Agent – analyses a chapter and produces blurb, genre tags
and content warnings for the Leaf platform.

Public API
----------
from metadata_agent import StoryMetadataAgent, AgentConfig

agent = StoryMetadataAgent(AgentConfig())
result = agent.analyse(chapter_html="<p>…</p>", story_title="My Story")
print(result.blurb, result.genres, result.tags, result.content_warnings)
"""
from .agent import StoryMetadataAgent  # noqa: F401
from .config import AgentConfig  # noqa: F401
from .models import ChapterAnalysisInput, ChapterMetadataOutput  # noqa: F401

__all__ = [
    "StoryMetadataAgent",
    "AgentConfig",
    "ChapterAnalysisInput",
    "ChapterMetadataOutput",
]
