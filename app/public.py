from flask import Blueprint,render_template,abort
from .models import Course,CourseCategory,WebsiteContent,Review,Quiz
public_bp=Blueprint("public",__name__)
def content(k,f=""): 
    x=WebsiteContent.query.filter_by(content_key=k).first(); return x.content_value if x else f
@public_bp.route("/")
def home(): return render_template("public/home.html",hero_title=content("hero_title","Build Your Cybersecurity Future"),hero_text=content("hero_text","Practical, industry-ready cybersecurity education."),course_heading=content("course_heading","Featured Cybersecurity Courses"),reviews=Review.query.filter_by(published=True).all(),courses=Course.query.filter_by(status="published").limit(6).all())
@public_bp.route("/courses")
def courses(): return render_template("public/courses.html",courses=Course.query.filter_by(status="published").all(),categories=CourseCategory.query.all())
@public_bp.route("/course/<int:course_id>")
def course_detail(course_id):
    c=Course.query.get_or_404(course_id)
    if c.status!="published":abort(404)
    return render_template("public/course_detail.html",course=c)
@public_bp.route("/materials")
def materials(): return render_template("public/materials.html",courses=Course.query.filter_by(status="published").all())
@public_bp.route("/quizzes")
def quizzes(): return render_template("public/quizzes.html",quizzes=Quiz.query.filter_by(published=True).all())
@public_bp.route("/certificates")
def certificates(): return render_template("public/certificates.html")
@public_bp.route("/about")
def about(): return render_template("public/about.html",about=content("about","Cyber World University is an online cybersecurity learning platform."))
@public_bp.route("/contact")
def contact(): return render_template("public/contact.html")
