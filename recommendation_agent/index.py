"""Normalized-vector index, backed by FAISS when available."""
import numpy as np


def cosine_from_l2(distance: float) -> float: return max(0.0, min(1.0, 1 - distance / 2))


class VectorIndex:
    def __init__(self, dimension: int):
        self.dimension, self.vectors = dimension, {}
        try:
            import faiss
            self._faiss = faiss
            self.index = faiss.IndexIDMap(faiss.IndexFlatL2(dimension))
        except ImportError:
            self._faiss, self.index = None, None
    @property
    def ntotal(self): return len(self.vectors)
    def upsert(self, story_id: int, vector: np.ndarray) -> None:
        vector = np.asarray(vector, dtype=np.float32).reshape(1, -1)
        self.remove(story_id); self.vectors[story_id] = vector[0]
        if self.index is not None: self.index.add_with_ids(vector, np.array([story_id], dtype=np.int64))
    def remove(self, story_id: int) -> None:
        self.vectors.pop(story_id, None)
        if self.index is not None: self.index.remove_ids(np.array([story_id], dtype=np.int64))
    def search(self, vector: np.ndarray, k: int) -> list[tuple[int, float]]:
        if k <= 0 or not self.vectors: return []
        q = np.asarray(vector, dtype=np.float32).reshape(1, -1)
        if self.index is not None:
            distances, ids = self.index.search(q, min(k, self.ntotal))
            return [(int(i), cosine_from_l2(float(d))) for i, d in zip(ids[0], distances[0]) if i >= 0]
        return sorted(((sid, float(np.dot(q[0], v))) for sid, v in self.vectors.items()), key=lambda x: x[1], reverse=True)[:k]
