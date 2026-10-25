from flask import Blueprint, jsonify, request
from sqlalchemy import func
from app.models import ContentWarning, Genre, Story, Tag, User

bp = Blueprint("meta", __name__)


@bp.get("/genres")
def genres():
    return jsonify(genres=[g.name for g in Genre.query.order_by(Genre.name).all()])


@bp.get("/warnings")
def warnings():
    return jsonify(warnings=[w.name for w in ContentWarning.query.order_by(ContentWarning.name).all()])


@bp.get("/tags")
def tags():
    q = (request.args.get("q") or "").strip()
    query = Tag.query
    if q:
        query = query.filter(func.lower(Tag.name).contains(q.lower()))
    return jsonify(tags=[t.name for t in query.order_by(Tag.name).limit(20).all()])


@bp.get("/stats")
def stats():
    return jsonify(
        writers=User.query.filter_by(role="author").count(),
        readers=User.query.filter_by(role="reader").count(),
        stories=Story.query.filter(Story.status.in_(["published", "completed"])).count(),
    )
