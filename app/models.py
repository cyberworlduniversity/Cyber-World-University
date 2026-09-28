from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

class User(UserMixin, db.Model):
    id=db.Column(db.Integer,primary_key=True); name=db.Column(db.String(150),nullable=False); email=db.Column(db.String(180),unique=True,nullable=False); password_hash=db.Column(db.String(255),nullable=False); role=db.Column(db.String(20),default="student"); active=db.Column(db.Boolean,default=True); created_at=db.Column(db.DateTime,default=datetime.utcnow)
    enrollments=db.relationship("Enrollment",back_populates="student",cascade="all, delete-orphan")
    progress=db.relationship("StudentProgress",back_populates="student",cascade="all, delete-orphan")
    certificates=db.relationship("Certificate",back_populates="student",cascade="all, delete-orphan")
    def set_password(self,p): self.password_hash=generate_password_hash(p)
    def check_password(self,p): return check_password_hash(self.password_hash,p)

class CourseCategory(db.Model):
    id=db.Column(db.Integer,primary_key=True); name=db.Column(db.String(120),unique=True,nullable=False)
    courses=db.relationship("Course",back_populates="category",cascade="all, delete-orphan")
class Course(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); instructor=db.Column(db.String(150),default="CWU Instructor"); level=db.Column(db.String(50),default="Beginner"); duration=db.Column(db.String(80),default=""); thumbnail=db.Column(db.String(255)); objectives=db.Column(db.Text,default=""); requirements=db.Column(db.Text,default=""); price=db.Column(db.Float,default=0); status=db.Column(db.String(30),default="draft"); category_id=db.Column(db.Integer,db.ForeignKey("course_categories.id")); created_at=db.Column(db.DateTime,default=datetime.utcnow)
    category=db.relationship("CourseCategory",back_populates="courses"); phases=db.relationship("CoursePhase",back_populates="course",cascade="all, delete-orphan",order_by="CoursePhase.order_index"); enrollments=db.relationship("Enrollment",back_populates="course",cascade="all, delete-orphan"); quizzes=db.relationship("Quiz",back_populates="course",cascade="all, delete-orphan"); exams=db.relationship("Exam",back_populates="course",cascade="all, delete-orphan")
class CoursePhase(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); order_index=db.Column(db.Integer,default=0); course_id=db.Column(db.Integer,db.ForeignKey("courses.id"),nullable=False)
    course=db.relationship("Course",back_populates="phases"); lessons=db.relationship("Lesson",back_populates="phase",cascade="all, delete-orphan",order_by="Lesson.order_index")
class Lesson(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); order_index=db.Column(db.Integer,default=0); published=db.Column(db.Boolean,default=False); phase_id=db.Column(db.Integer,db.ForeignKey("course_phases.id"),nullable=False)
    phase=db.relationship("CoursePhase",back_populates="lessons"); videos=db.relationship("Video",back_populates="lesson",cascade="all, delete-orphan"); materials=db.relationship("Material",back_populates="lesson",cascade="all, delete-orphan")
class Video(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); filename=db.Column(db.String(255),nullable=False); duration=db.Column(db.String(50),default=""); published=db.Column(db.Boolean,default=False); lesson_id=db.Column(db.Integer,db.ForeignKey("lessons.id"),nullable=False); created_at=db.Column(db.DateTime,default=datetime.utcnow)
    lesson=db.relationship("Lesson",back_populates="videos")
class Material(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); filename=db.Column(db.String(255),nullable=False); file_type=db.Column(db.String(30),default=""); published=db.Column(db.Boolean,default=False); lesson_id=db.Column(db.Integer,db.ForeignKey("lessons.id"),nullable=False); created_at=db.Column(db.DateTime,default=datetime.utcnow)
    lesson=db.relationship("Lesson",back_populates="materials")
class Question(db.Model):
    id=db.Column(db.Integer,primary_key=True); text=db.Column(db.Text,nullable=False); type=db.Column(db.String(20),default="mcq"); correct_answer=db.Column(db.String(255),nullable=False); explanation=db.Column(db.Text,default=""); marks=db.Column(db.Integer,default=1); difficulty=db.Column(db.String(30),default="Medium"); topic=db.Column(db.String(120),default=""); course_id=db.Column(db.Integer,db.ForeignKey("courses.id"),nullable=False)
    options=db.relationship("QuestionOption",back_populates="question",cascade="all, delete-orphan")
class QuestionOption(db.Model):
    id=db.Column(db.Integer,primary_key=True); label=db.Column(db.String(5),nullable=False); text=db.Column(db.Text,nullable=False); question_id=db.Column(db.Integer,db.ForeignKey("questions.id"),nullable=False); question=db.relationship("Question",back_populates="options")
class Quiz(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); course_id=db.Column(db.Integer,db.ForeignKey("courses.id"),nullable=False); num_questions=db.Column(db.Integer,default=10); time_limit=db.Column(db.Integer,default=15); passing_percentage=db.Column(db.Float,default=50); published=db.Column(db.Boolean,default=False); course=db.relationship("Course",back_populates="quizzes")
class Exam(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); course_id=db.Column(db.Integer,db.ForeignKey("courses.id"),nullable=False); duration=db.Column(db.Integer,default=60); passing_percentage=db.Column(db.Float,default=50); published=db.Column(db.Boolean,default=False); course=db.relationship("Course",back_populates="exams")
class Enrollment(db.Model):
    id=db.Column(db.Integer,primary_key=True); student_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False); course_id=db.Column(db.Integer,db.ForeignKey("courses.id"),nullable=False); enrolled_at=db.Column(db.DateTime,default=datetime.utcnow)
    student=db.relationship("User",back_populates="enrollments"); course=db.relationship("Course",back_populates="enrollments")
class StudentProgress(db.Model):
    id=db.Column(db.Integer,primary_key=True); student_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False); lesson_id=db.Column(db.Integer,db.ForeignKey("lessons.id"),nullable=False); completed=db.Column(db.Boolean,default=False); student=db.relationship("User",back_populates="progress")
class QuizAttempt(db.Model):
    id=db.Column(db.Integer,primary_key=True); student_id=db.Column(db.Integer,nullable=False); quiz_id=db.Column(db.Integer,nullable=False); score=db.Column(db.Float,default=0); percentage=db.Column(db.Float,default=0); submitted_at=db.Column(db.DateTime,default=datetime.utcnow)
class ExamAttempt(db.Model):
    id=db.Column(db.Integer,primary_key=True); student_id=db.Column(db.Integer,nullable=False); exam_id=db.Column(db.Integer,nullable=False); score=db.Column(db.Float,default=0); percentage=db.Column(db.Float,default=0); submitted_at=db.Column(db.DateTime,default=datetime.utcnow)
class Certificate(db.Model):
    id=db.Column(db.Integer,primary_key=True); certificate_number=db.Column(db.String(80),unique=True,nullable=False); student_id=db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False); course_id=db.Column(db.Integer,nullable=False); completion_date=db.Column(db.DateTime,default=datetime.utcnow); student=db.relationship("User",back_populates="certificates")
class Advertisement(db.Model):
    id=db.Column(db.Integer,primary_key=True); title=db.Column(db.String(180),nullable=False); description=db.Column(db.Text,default=""); image=db.Column(db.String(255)); button_text=db.Column(db.String(80),default="Learn More"); destination_url=db.Column(db.String(500),default="#"); location=db.Column(db.String(50),default="home"); active=db.Column(db.Boolean,default=True)
class Review(db.Model):
    id=db.Column(db.Integer,primary_key=True); student_name=db.Column(db.String(150),nullable=False); rating=db.Column(db.Integer,default=5); content=db.Column(db.Text,nullable=False); published=db.Column(db.Boolean,default=True)
class WebsiteContent(db.Model):
    id=db.Column(db.Integer,primary_key=True); content_key=db.Column(db.String(100),unique=True,nullable=False); content_value=db.Column(db.Text,default="")
class Setting(db.Model):
    id=db.Column(db.Integer,primary_key=True); setting_key=db.Column(db.String(100),unique=True,nullable=False); setting_value=db.Column(db.Text,default="")
