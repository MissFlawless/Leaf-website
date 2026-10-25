"""Repository boundary; this module deliberately knows no web framework."""
from abc import ABC, abstractmethod
from .models import Story


class StoryRepository(ABC):
    @abstractmethod
    def list_stories(self) -> list[Story]:
        """Return catalog stories; caller filters publication state."""

    @abstractmethod
    def get_story(self, story_id: int) -> Story | None:
        """Find a story by id."""


class InMemoryStoryRepository(StoryRepository):
    def __init__(self, stories: list[Story] | None = None):
        self._stories = {story.id: story for story in stories or []}

    def list_stories(self) -> list[Story]:
        return list(self._stories.values())

    def get_story(self, story_id: int) -> Story | None:
        return self._stories.get(story_id)

    def upsert(self, story: Story) -> None:
        self._stories[story.id] = story

    def remove(self, story_id: int) -> None:
        self._stories.pop(story_id, None)
