import os
import uuid
from pathlib import Path
from PIL import Image
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}


def upload_dir():
    path = Path(current_app.config["UPLOAD_FOLDER"])
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_image(file_storage):
    if not file_storage or not file_storage.filename:
        raise ValueError("No image was uploaded.")
    ext = secure_filename(file_storage.filename).rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Only jpg, png, webp and gif images are allowed.")
    file_storage.stream.seek(0, os.SEEK_END)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > 5 * 1024 * 1024:
        raise ValueError("Images must be 5 MB or smaller.")
    try:
        image = Image.open(file_storage.stream)
        image.verify()
    except Exception as exc:
        raise ValueError("Uploaded file is not a valid image.") from exc
    file_storage.stream.seek(0)
    name = f"{uuid.uuid4().hex}.{ext}"
    file_storage.save(upload_dir() / name)
    return name


def delete_image(filename):
    if not filename:
        return
    path = upload_dir() / filename
    if path.exists():
        path.unlink()
