from flask import Blueprint,render_template,request,redirect,url_for,flash
from flask_login import login_user,logout_user,current_user
from .extensions import db
from .models import User
auth_bp=Blueprint("auth",__name__)
@auth_bp.route("/login",methods=["GET","POST"])
def login():
    if current_user.is_authenticated:return redirect(url_for("admin.dashboard" if current_user.role=="admin" else "student.dashboard"))
    if request.method=="POST":
        u=User.query.filter_by(email=request.form.get("email","").strip().lower()).first()
        if u and u.active and u.check_password(request.form.get("password","")): login_user(u); return redirect(request.args.get("next") or url_for("student.dashboard"))
        flash("Invalid email or password.","error")
    return render_template("public/login.html")
@auth_bp.route("/register",methods=["GET","POST"])
def register():
    if request.method=="POST":
        name=request.form.get("name","").strip(); email=request.form.get("email","").strip().lower(); password=request.form.get("password","")
        if not name or not email or len(password)<8: flash("Enter valid details. Password must be at least 8 characters.","error")
        elif User.query.filter_by(email=email).first(): flash("Email already registered.","error")
        else:
            u=User(name=name,email=email); u.set_password(password); db.session.add(u); db.session.commit(); flash("Registration successful.","success"); return redirect(url_for("auth.login"))
    return render_template("public/register.html")
@auth_bp.route("/logout")
def logout(): logout_user(); return redirect(url_for("public.home"))
