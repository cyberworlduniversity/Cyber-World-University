from flask import Flask
from config import Config
from .extensions import db, login_manager, csrf

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app); login_manager.init_app(app); csrf.init_app(app)
    from .models import User, Advertisement
    from .public import public_bp
    from .auth import auth_bp
    from .student import student_bp
    from .admin import admin_bp
    app.register_blueprint(public_bp); app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp, url_prefix="/student")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    @login_manager.user_loader
    def load_user(user_id): return User.query.get(int(user_id))
    @app.context_processor
    def globals():
        from datetime import date
        ads=Advertisement.query.filter_by(active=True).all()
        ads=[a for a in ads if (not a.start_date or a.start_date<=date.today()) and (not a.end_date or a.end_date>=date.today())]
        return {"active_ads":ads}
    with app.app_context():
        db.create_all()
        from .seed import seed_data
        seed_data()
    return app
