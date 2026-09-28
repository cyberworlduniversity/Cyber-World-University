# Cyber World University (CWU)

A modern, responsive cybersecurity learning platform with a public website, student learning system, protected admin panel, MongoDB persistence, and Vercel serverless APIs.

## Technology

- Frontend: HTML5, CSS3, vanilla JavaScript
- Main backend language/runtime: Node.js 24.x
- API: Vercel Node.js serverless functions
- Database: MongoDB
- Deployment: Vercel
- Authentication: HTTP-only session cookie + server-side password hashing

## Vercel configuration

Static HTML/CSS/JavaScript files are served directly and `/api/*.js` files run as Node.js serverless functions. Required environment variables are `MONGODB_URI` and optional `MONGODB_DB` (defaults to `cwu`). Never commit database credentials or API keys.

## Security

Server-side authentication and authorization, HTTP-only sessions, password hashing, admin role checks, ObjectId validation, server-side quiz/exam scoring, hidden correct answers, attempt/time limits, secure response headers, input validation, and output escaping are used throughout the platform.

## Current platform

Dynamic courses, phases, lessons, question bank, quizzes, final exams, student progress, certificates, admin management, and protected student APIs.

Current release: **3.1.0**
