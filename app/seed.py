from .extensions import db
from .models import User,CourseCategory,Course,Review,WebsiteContent
CATEGORIES=["Cyber Security Fundamentals","Ethical Hacking","Network Security","Web Application Security","Python for Cybersecurity","Digital Forensics","Malware Analysis","Cloud Security","Penetration Testing","Bug Bounty","Linux for Cybersecurity","Cyber Defense"]
def seed_data():
    if not User.query.filter_by(email="admin@cyberworlduniversity.com").first():
        u=User(name="CWU Administrator",email="admin@cyberworlduniversity.com",role="admin");u.set_password("Admin@12345");db.session.add(u)
    for n in CATEGORIES:
        if not CourseCategory.query.filter_by(name=n).first():db.session.add(CourseCategory(name=n))
    if not Review.query.first():db.session.add(Review(student_name="CWU Student",content="Practical cybersecurity learning with clear structure."))
    defaults={"hero_title":"Build Your Cybersecurity Future","hero_text":"Practical, industry-ready cybersecurity education from Cyber World University.","course_heading":"Featured Cybersecurity Courses","about":"Cyber World University is an online cybersecurity learning platform focused on practical skills."}
    for k,v in defaults.items():
        if not WebsiteContent.query.filter_by(content_key=k).first():db.session.add(WebsiteContent(content_key=k,content_value=v))
    if not Course.query.first(): db.session.add(Course(title="Cyber Security Fundamentals",description="Learn core cybersecurity concepts and safe security practices.",instructor="E. Hemanathan",level="Beginner",duration="6 Weeks",status="published",category=CourseCategory.query.first()))
    db.session.commit()
