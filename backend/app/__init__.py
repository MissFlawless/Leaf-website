from pathlib import Path
from flask import Flask, jsonify, send_from_directory
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=False)

from app.config import Config
from app.extensions import cors, db, jwt, migrate
from app.models import User


def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    configured_origins = app.config["FRONTEND_ORIGIN"]
    if isinstance(configured_origins, str):
        configured_origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
    # Developers may launch Vite on the documented fallback port or open the
    # site as 127.0.0.1. Keep both local origins available even with a .env value.
    configured_origins = list(dict.fromkeys(list(configured_origins) + [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ]))
    cors.init_app(app, origins=configured_origins, supports_credentials=True)

    @jwt.user_lookup_loader
    def load_user(_headers, payload):
        identity = payload.get("sub")
        return db.session.get(User, int(identity)) if identity else None

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify(error="Not found."), 404

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify(error="Uploaded file is too large."), 413

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    from app.routes.auth import bp as auth_bp
    from app.routes.meta import bp as meta_bp
    from app.routes.stories import bp as stories_bp
    from app.routes.chapters import bp as chapters_bp
    from app.routes.comments import bp as comments_bp
    from app.routes.library import bp as library_bp
    from app.routes.notebooks import bp as notebooks_bp
    from app.routes.dashboard import bp as dashboard_bp
    from app.routes.notifications import bp as notifications_bp
    from app.routes.recommendations import bp as recommendations_bp
    from app.routes.metadata import bp as metadata_analysis_bp  # Story Metadata Agent

    for bp in [auth_bp, meta_bp, stories_bp, chapters_bp, comments_bp, library_bp, notebooks_bp, dashboard_bp, notifications_bp, recommendations_bp, metadata_analysis_bp]:
        app.register_blueprint(bp, url_prefix="/api")

    from app.recommendations import initialize_recommendations
    if not app.config.get("TESTING"):
        initialize_recommendations(app)

    @app.cli.command("reindex_recommendations")
    def reindex_recommendations():
        """Rebuild persisted vectors and the in-memory recommendation index."""
        from app.recommendations import RecommendationService
        app.extensions["recommendations"] = RecommendationService()
        print("Recommendation index rebuilt.")

    return app
