# Cyber World University — Complete Website & Admin Panel Development Prompt

## 1. Website Identity
Name: Cyber World University
Short name: CWU
Purpose: Online cybersecurity education and student learning platform.
Website only; not a mobile application.
Use a professional cybersecurity-themed, modern, clean, responsive interface with attractive course cards, smooth animations, and clear navigation.

## 2. Public Website
Pages:
- Home
- Courses
- Course Details
- Study Materials
- Quizzes
- Certificates
- About
- Contact
- Student Login
- Student Registration
- Student Dashboard

Do NOT include an AI Assistant page.

## 3. Homepage
Include CWU branding/logo, navigation, hero section, Start Learning/Get Started CTA, featured courses, course categories, Why Choose CWU, learning process, student statistics, certificate section, reviews, advertisement banner, and footer.
Advertisement banners must be controlled from the Admin Panel.

## 4. Dynamic Course System
Courses must come from the backend/database rather than being hard-coded in HTML.
Each course supports:
- title, thumbnail, description, category, instructor, level, duration
- lesson/quiz counts
- price/free status
- course status
- learning objectives and requirements
- syllabus
- video lessons
- PDF/notes/materials
- quizzes
- final examination
- certificate eligibility

Categories:
1. Cyber Security Fundamentals
2. Ethical Hacking
3. Network Security
4. Web Application Security
5. Python for Cybersecurity
6. Digital Forensics
7. Malware Analysis
8. Cloud Security
9. Penetration Testing
10. Bug Bounty
11. Linux for Cybersecurity
12. Cyber Defense

## 5. Course Creation
Admin can create courses with name, description, category, level, instructor, duration, thumbnail, objectives, requirements, price/free status, and publication status.

## 6. Course Phases / Modules
Structure:
Course → Phase → Lessons → Videos → Materials → Questions

Admin can add, edit, delete, reorder, publish/unpublish phases and lessons.

## 7. Video Management
Admin can upload, edit, replace, delete, publish/unpublish and reorder videos; assign each video to course, phase and lesson; provide title, description, thumbnail and duration.
Use secure file validation and reasonable upload-size/type restrictions.
Students see published videos according to course structure.

## 8. Study Materials
Support PDF, DOC/DOCX, PPT/PPTX, TXT and appropriate ZIP files.
Each material has title, description, course, phase, lesson, file, upload date and status.
Admin can upload, edit, replace, delete, publish/unpublish and organize materials.
Students can access published materials available to them.

## 9. Question Bank
Each course must support a minimum capacity of 100 questions.
Question types: Multiple Choice and True/False.
MCQ fields: question, options A-D, correct answer, explanation, marks, difficulty, phase and topic.
Admin can add, edit, delete, duplicate, search, filter, import, export, organize and publish/unpublish questions.

## 10. Quiz System
Admin configures quiz title, course, phase, question count, time limit, passing percentage, marks/question, randomization, order, attempt limit, availability dates and publication.
Quizzes select questions from the course question bank.

## 11. Final Examination
Admin configures minimum/maximum question count, duration, passing percentage, attempts, random selection, navigation, result calculation and certificate eligibility.
Students receive results after completion.

## 12. Certificate System
After configured requirements are met, students become eligible for certificates containing CWU branding, student name, course, completion date, certificate number and verification information.
Admin manages certificate settings.

## 13. Advertisement Banner Management
Admin can upload/manage banners with image, title, description, button text, destination URL, start/end dates, enabled state and display order.
Published banners can appear on:
- Homepage
- Course page
- Course details page
- Materials page
- Quiz page

## 14. Admin Dashboard
Display:
- total students
- total/published courses
- total lessons/videos/materials/questions
- total quizzes/examinations
- certificates issued
- active advertisements
Provide useful charts/statistics.

## 15. Admin Menu
Dashboard
Courses
- All Courses
- Add Course
- Categories
- Course Content
Videos
Materials
Question Bank
Quizzes
Examinations
Certificates
Advertisements
Students
Reviews
Website Content
Settings
Admin Profile
Logout

## 16. Website Content Management
Provide CMS-style editing without requiring HTML changes.
Admin can edit homepage title/hero/buttons, About content, course headings, features, statistics, reviews, contact information, footer content, social links and advertisements.
Published changes must appear on the public website.

## 17. Student System
Students can register, login/logout, view dashboard, browse/enroll in courses, watch published lessons, access materials, take quizzes/exams, view results, track progress, view certificate eligibility and access certificates.

## 18. Student Dashboard
Show welcome message, enrolled courses, course progress, completed lessons, quiz scores, examination results, certificates and recent activity.

## 19. Security
Implement secure authentication, password hashing, session management, role separation, protected admin routes, server-side validation, file-type/size validation, authorization, secure uploads, CSRF protection where applicable, input sanitization and error handling.
Never expose administrator credentials in frontend code.

## 20. Recommended Technology
Frontend:
- HTML5
- CSS3
- JavaScript
- Responsive design

Backend:
- Python Flask

Database:
- MySQL

Use a proper backend/database architecture so courses, videos, materials, questions, students, advertisements, quizzes and certificates are stored dynamically.

## 21. Database Structure
Use appropriate relational tables such as:
users, admins, students, courses, course_categories, course_phases, lessons, videos, materials, questions, question_options, quizzes, quiz_questions, exams, exam_questions, enrollments, student_progress, quiz_attempts, exam_attempts, certificates, advertisements, reviews, website_content, settings.
Use relationships and foreign keys appropriately.

## 22. Critical Dynamic Workflow
Admin creates course
→ adds phases
→ adds lessons
→ uploads videos
→ uploads materials
→ creates 100+ questions
→ creates quiz/exam
→ publishes course
→ course automatically appears on the public website.

Do NOT hard-code the complete course system into HTML.

## 23. Responsive Design
Support desktop, laptop, tablet, Android phones and iPhone.
Use responsive navigation, cards, tables, forms, dashboards, video players and admin screens.

## 24. UI Design
Use a modern cybersecurity education style:
- professional dark/light interface
- blue/neon-green accents
- modern cards
- rounded components
- clean typography
- smooth hover effects
- responsive sidebar
- professional dashboard
- progress indicators
- attractive buttons
- accessible forms
Do not make the interface unnecessarily complicated.

## 25. Project Quality
Build a complete working application, not merely a visual mockup.
Requirements:
- clean folder structure
- reusable components/templates
- routing
- database integration
- authentication
- CRUD operations
- file uploads
- course management
- question management
- quiz/exam system
- advertisement management
- certificate management
- admin CMS
- student dashboard
- error handling
- README with installation instructions

## 26. Final Goal
The final CWU platform must allow an administrator to manage the entire educational website from one Admin Panel:
Create → Edit → Upload → Organize → Publish → Update → Delete
courses, phases, lessons, videos, materials, questions, quizzes, exams, certificates, advertisements and website content.

Students must automatically see updated published information on the public CWU website.
