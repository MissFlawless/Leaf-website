# Recommendation Agent

Framework-independent hybrid story search. `RecommendationAgent(repository, embedder).search(query)` returns a primary result and diverse related stories. Use `FakeEmbedder` for local tests; `SentenceTransformerEmbedder` lazily loads the multilingual production model.

Run `python -m pytest recommendation_agent -v` and `python -m recommendation_agent.demo "fantasy dragons"` from the repository root. The evaluator additionally needs Pandas. Install the pinned dependencies with `python -m pip install -r recommendation_agent/requirements.txt`; these pins include Windows/Python 3.13 compatible FAISS and Torch releases.

`RankingConfig` reads `RECOMMENDATION_{SEMANTIC,GENRE,TAG}_WEIGHT`, `RECOMMENDATION_MIN_SCORE`, model names, and LLM enablement from the environment. The LLM is opt-in and invoked only through `explain()`.

The flat in-memory index suits modest catalogs; persistent embeddings, background indexing, request timeouts, and database integration belong to the host application. The NumPy fallback lets tests run without FAISS but production should install FAISS.
