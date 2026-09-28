import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost/cwu_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 524288000))
    UPLOAD_EXTENSIONS = {
        "video": {"mp4", "webm", "mov"},
        "material": {"pdf", "doc", "docx", "ppt", "pptx", "txt", "zip"},
        "image": {"png", "jpg", "jpeg", "webp"}
    }
