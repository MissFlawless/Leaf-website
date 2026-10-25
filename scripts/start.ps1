$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
docker compose up -d postgres
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; `$env:FLASK_APP='run.py'; ..\backend\.venv\Scripts\python -m flask run --host 0.0.0.0 --port 5000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev -- --host 0.0.0.0"
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5173"
