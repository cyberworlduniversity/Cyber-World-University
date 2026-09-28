from flask import Blueprint,render_template,redirect,url_for,request
from flask_login import login_required,current_user
from .extensions import db
from .models import Course,Enrollment,StudentProgress,Lesson,QuizAttempt,ExamAttempt,Certificate
student_bp=Blueprint("student",__name__)
@student_bp.route("/dashboard")
@login_required
def dashboard(): return render_template("student/dashboard.html",enrollments=Enrollment.query.filter_by(student_id=current_user.id).all())
@student_bp.route("/courses")
@login_required
def courses(): return render_template("student/courses.html",courses=Course.query.filter_by(status="published").all())
@student_bp.route("/enroll/<int:course_id>",methods=["POST"])
@login_required
def enroll(course_id):
    c=Course.query.get_or_404(course_id)
    if not Enrollment.query.filter_by(student_id=current_user.id,course_id=c.id).first(): db.session.add(Enrollment(student_id=current_user.id,course_id=c.id)); db.session.commit()
    return redirect(url_for("student.learning",course_id=c.id))
@student_bp.route("/learning/<int:course_id>")
@login_required
def learning(course_id): return render_template("student/learning.html",course=Course.query.get_or_404(course_id))
@student_bp.route("/lesson/<int:lesson_id>/complete",methods=["POST"])
@login_required
def complete_lesson(lesson_id):
    l=Lesson.query.get_or_404(lesson_id); p=StudentProgress.query.filter_by(student_id=current_user.id,lesson_id=l.id).first() or StudentProgress(student_id=current_user.id,lesson_id=l.id)
    p.completed=True; db.session.add(p); db.session.commit(); return redirect(url_for("student.learning",course_id=l.phase.course_id))
@student_bp.route("/results")
@login_required
def results(): return render_template("student/results.html",quizzes=QuizAttempt.query.filter_by(student_id=current_user.id).all(),exams=ExamAttempt.query.filter_by(student_id=current_user.id).all(),certificates=Certificate.query.filter_by(student_id=current_user.id).all())
