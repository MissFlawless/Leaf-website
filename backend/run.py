import os
from pathlib import Path
from dotenv import load_dotenv

project_root = Path(__file__).resolve().parents[1]
load_dotenv(project_root / ".env", override=False)
load_dotenv(Path(__file__).resolve().parent / ".env", override=False)

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "0") == "1", use_reloader=False)
