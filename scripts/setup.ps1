$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
docker compose up -d postgres
if (!(Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
if (!(Test-Path frontend\.env)) { Copy-Item frontend\.env.example frontend\.env }
python -m venv backend\.venv
backend\.venv\Scripts\python -m pip install -r backend\requirements.txt
Push-Location backend
..\backend\.venv\Scripts\python -m flask db upgrade
..\backend\.venv\Scripts\python seed.py
Pop-Location
Push-Location frontend
npm install
Pop-Location
Write-Host "Leaf setup complete."
