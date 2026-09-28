# Cyber World University (CWU)

A Flask + MySQL cybersecurity learning platform with a responsive public website, student learning area, and protected administration panel.

## Features
- Public CWU homepage, course catalog, course details, materials, quizzes, certificates, about and contact pages
- Student registration, login, dashboard, enrolled courses, learning/progress and results
- Admin dashboard, course management, videos, materials, question bank, advertisements, website content and students
- Course → phase → lesson structure
- Upload validation for videos and learning materials
- Question bank designed for 100+ questions per course
- MySQL-ready SQL schema and Flask-SQLAlchemy models
- CSRF-aware forms and role-based access

## Stack
- Python 3.11+
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-WTF
- MySQL / PyMySQL
- HTML5, CSS3 and JavaScript

## Local setup
1. Create the MySQL database/user with `schema.sql`.
2. Create a virtual environment and install `requirements.txt`.
3. Copy `.env.example` to `.env` and set a strong `SECRET_KEY` and database URL.
4. Run `python run.py`.
5. Open `http://127.0.0.1:5000`.

## Repository structure
```
app/
  admin.py
  auth.py
  models.py
  public.py
  student.py
  templates/
  static/
config.py
run.py
schema.sql
requirements.txt
```

## Security
Do not commit real credentials or secrets. Change any development administrator credentials before deployment, use HTTPS, validate uploads, use a dedicated MySQL account, and configure production cookie/security settings.

## Status
This repository contains the CWU Flask/MySQL project files and is intended as the backend-enabled version of the Cyber World University website.
