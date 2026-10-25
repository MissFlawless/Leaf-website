"""Embedding implementations. Real model loading is lazy and one-time."""
from abc import ABC, abstractmethod
import hashlib
import re
import numpy as np


class Embedder(ABC):
    @abstractmethod
    def encode(self, texts: list[str]) -> np.ndarray: ...


class FakeEmbedder(Embedder):
    def __init__(self, dimension: int = 128): self.dimension = dimension
    def encode(self, texts: list[str]) -> np.ndarray:
        result = np.zeros((len(texts), self.dimension), dtype=np.float32)
        for row, text in enumerate(texts):
            for token in re.findall(r"\w+", text.lower(), flags=re.UNICODE):
                result[row, int(hashlib.sha256(token.encode()).hexdigest(), 16) % self.dimension] += 1
        norms = np.linalg.norm(result, axis=1, keepdims=True); norms[norms == 0] = 1
        return result / norms


class SentenceTransformerEmbedder(Embedder):
    def __init__(self, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"):
        self.model_name, self._model = model_name, None
    def encode(self, texts: list[str]) -> np.ndarray:
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
        values = np.asarray(self._model.encode(texts), dtype=np.float32)
        norms = np.linalg.norm(values, axis=1, keepdims=True); norms[norms == 0] = 1
        return values / norms
