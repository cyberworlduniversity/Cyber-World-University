from flask import Blueprint,render_template,request,redirect,url_for,flash
from flask_login import login_required
from .extensions import db
from .models import *
from .utils import admin_required,save_upload
admin_bp=Blueprint("admin",__name__)
@admin_bp.before_request
@login_required
def protect(): pass
@admin_bp.route("/")
@admin_required
def dashboard():
    stats={"students":User.query.filter_by(role="student").count(),"courses":Course.query.count(),"published":Course.query.filter_by(status="published").count(),"lessons":Lesson.query.count(),"videos":Video.query.count(),"materials":Material.query.count(),"questions":Question.query.count(),"quizzes":Quiz.query.count(),"exams":Exam.query.count(),"certificates":Certificate.query.count(),"ads":Advertisement.query.filter_by(active=True).count()}
    return render_template("admin/dashboard.html",stats=stats)
@admin_bp.route("/courses")
@admin_required
def courses(): return render_template("admin/courses.html",courses=Course.query.all())
@admin_bp.route("/courses/add",methods=["GET","POST"])
@admin_required
def add_course():
    if request.method=="POST":
        c=Course(title=request.form["title"],description=request.form.get("description",""),category_id=request.form.get("category_id") or None,instructor=request.form.get("instructor","CWU Instructor"),level=request.form.get("level","Beginner"),duration=request.form.get("duration",""),price=float(request.form.get("price") or 0),status=request.form.get("status","draft"),objectives=request.form.get("objectives",""),requirements=request.form.get("requirements",""));db.session.add(c);db.session.commit();flash("Course created.","success");return redirect(url_for("admin.courses"))
    return render_template("admin/course_form.html",course=None,categories=CourseCategory.query.all())
@admin_bp.route("/students")
@admin_required
def students(): return render_template("admin/students.html",students=User.query.filter_by(role="student").all())
@admin_bp.route("/content",methods=["GET","POST"])
@admin_required
def content():
    if request.method=="POST":
        for k,v in request.form.items():
            if k.startswith("content_"):
                key=k[8:]; item=WebsiteContent.query.filter_by(content_key=key).first() or WebsiteContent(content_key=key);item.content_value=v;db.session.add(item)
        db.session.commit();flash("Website content updated.","success")
    return render_template("admin/content.html",items=WebsiteContent.query.all())
@admin_bp.route("/questions",methods=["GET","POST"])
@admin_required
def questions():
    if request.method=="POST":
        q=Question(text=request.form["text"],type=request.form.get("type","mcq"),correct_answer=request.form["correct_answer"],course_id=request.form["course_id"]);db.session.add(q);db.session.commit();flash("Question added.","success")
    return render_template("admin/questions.html",questions=Question.query.all(),courses=Course.query.all())
