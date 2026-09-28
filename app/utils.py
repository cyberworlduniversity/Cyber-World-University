from functools import wraps
from flask import abort, current_app
from flask_login import current_user
from werkzeug.utils import secure_filename
from pathlib import Path
import uuid

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role!="admin": abort(403)
        return f(*args, **kwargs)
    return wrapper

def save_upload(file, folder, allowed):
    if not file or not file.filename: return None
    ext=file.filename.rsplit(".",1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed: raise ValueError("Unsupported file type")
    filename=f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    path=Path(current_app.static_folder)/"uploads"/folder/filename
    path.parent.mkdir(parents=True,exist_ok=True); file.save(path)
    return f"uploads/{folder}/{filename}"
