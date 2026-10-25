# Leaf

## Run the project in VS Code terminal

This project is set up to run locally without installing PostgreSQL on Windows. Use SQLite for local development.

### 1) Open a terminal in VS Code

From the project root:

```powershell
cd "C:\Users\bhjis\Desktop\Leaf"
```

### 2) Create the backend env file

```powershell
copy backend\.env.example backend\.env
```

The file should contain:

```env
SECRET_KEY=dev-change-me
JWT_SECRET_KEY=dev-jwt-change-me
DATABASE_URL=sqlite:///leaf.db
FRONTEND_ORIGIN=http://localhost:5173
UPLOAD_FOLDER=uploads
```

### 3) Start the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m flask db upgrade
python seed.py
python run.py
```

The backend should run at:

- http://localhost:5000

### 4) Start the frontend cleanly

Open a second VS Code terminal and run:

```powershell
cd "C:\Users\bhjis\Desktop\Leaf\frontend"
.\node_modules\.bin\vite.cmd --host 0.0.0.0 --port 5173 --strictPort
```

If port 5173 is already in use, use a different port:

```powershell
.\node_modules\.bin\vite.cmd --host 0.0.0.0 --port 5175 --strictPort
```

Then open:

- http://localhost:5173
- or http://localhost:5175 if you used the fallback port

### 5) If the frontend still shows a 404

This usually means a stale Vite process is still hanging around. Kill old Vite node processes and restart:

```powershell
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'vite' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
```

Then run the frontend command again.

### Notes

- The backend API is at http://localhost:5000
- The frontend app is at http://localhost:5173
- The SQLite database file is created automatically in the backend folder
- You do not need PostgreSQL installed for this local setup

if it shows a white page paste this in the terminal in the frontend folder : 
Get-CimInstance Win32_Process |                                     
>>   Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'vite' } |
>>   ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }