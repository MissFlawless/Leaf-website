#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose up -d postgres
(cd backend && ../backend/.venv/bin/python -m flask run --host 0.0.0.0 --port 5000) &
(cd frontend && npm run dev -- --host 0.0.0.0) &
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
wait
