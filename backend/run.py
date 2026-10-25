import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=False)
load_dotenv(Path(__file__).resolve().parent / ".env", override=False)

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "0") == "1", use_reloader=False)
