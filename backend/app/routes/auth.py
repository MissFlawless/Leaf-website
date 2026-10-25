import re
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, current_user, jwt_required
from app.extensions import db
from app.models import User
from app.utils.serializers import story_card, user_public
from app.utils.uploads import delete_image, save_image

bp = Blueprint("auth", __name__)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_registration(data):
    errors = {}
    email = (data.get("email") or "").strip().lower()
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    confirm = data.get("confirm_password") or data.get("confirmPassword") or ""
    role = data.get("role")
    if not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if not username or len(username) < 3:
        errors["username"] = "Username must be at least 3 characters."
    if len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."
    if password != confirm:
        errors["confirm_password"] = "Passwords do not match."
    if role not in {"reader", "author"}:
        errors["role"] = "Choose reader or author."
    if User.query.filter_by(email=email).first():
        errors["email"] = "Email is already registered."
    if User.query.filter_by(username=username).first():
        errors["username"] = "Username is already taken."
    return errors


@bp.post("/auth/register")
def register():
    data = request.get_json() or {}
    errors = validate_registration(data)
    if errors:
        return jsonify(error="Validation failed.", errors=errors), 400
    user = User(
        email=data["email"].strip().lower(),
        username=data["username"].strip(),
        display_name=data.get("display_name") or data["username"].strip(),
        role=data["role"],
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user_public(user)), 201


@bp.post("/auth/login")
def login():
    data = request.get_json() or {}
    login_id = (data.get("email") or data.get("username") or "").strip()
    user = User.query.filter((User.email == login_id.lower()) | (User.username == login_id)).first()
    if not user or not user.check_password(data.get("password") or ""):
        return jsonify(error="Invalid email or password."), 401
    return jsonify(token=create_access_token(identity=str(user.id)), user=user_public(user))


@bp.get("/auth/me")
@jwt_required()
def me():
    return jsonify(user=user_public(current_user))


@bp.put("/users/me")
@jwt_required()
def update_me():
    data = request.get_json() or {}
    display_name = (data.get("display_name") or current_user.display_name).strip()
    if not display_name or len(display_name) > 120:
        return jsonify(error="Display name must be between 1 and 120 characters."), 400
    if "username" in data:
        username = (data.get("username") or "").strip()
        if len(username) < 3 or len(username) > 80:
            return jsonify(error="Username must be between 3 and 80 characters."), 400
        if User.query.filter(User.username == username, User.id != current_user.id).first():
            return jsonify(error="Username is already taken."), 400
        current_user.username = username
    if "email" in data:
        email = (data.get("email") or "").strip().lower()
        if not EMAIL_RE.match(email):
            return jsonify(error="Enter a valid email address."), 400
        if User.query.filter(User.email == email, User.id != current_user.id).first():
            return jsonify(error="Email is already registered."), 400
        current_user.email = email
    current_user.display_name = display_name
    current_user.bio = data.get("bio", current_user.bio) or ""
    db.session.commit()
    return jsonify(user=user_public(current_user))


@bp.post("/users/me/avatar")
@jwt_required()
def avatar():
    try:
        filename = save_image(request.files.get("image"))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    delete_image(current_user.avatar)
    current_user.avatar = filename
    db.session.commit()
    return jsonify(user=user_public(current_user))


@bp.delete("/users/me/avatar")
@jwt_required()
def remove_avatar():
    delete_image(current_user.avatar)
    current_user.avatar = None
    db.session.commit()
    return jsonify(user=user_public(current_user))


@bp.post("/users/me/cover")
@jwt_required()
def profile_cover():
    try:
        filename = save_image(request.files.get("image"))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    delete_image(current_user.cover)
    current_user.cover = filename
    db.session.commit()
    return jsonify(user=user_public(current_user))


@bp.delete("/users/me/cover")
@jwt_required()
def remove_profile_cover():
    delete_image(current_user.cover)
    current_user.cover = None
    db.session.commit()
    return jsonify(user=user_public(current_user))


@bp.put("/users/me/password")
@jwt_required()
def password():
    data = request.get_json() or {}
    if not current_user.check_password(data.get("current_password") or ""):
        return jsonify(error="Current password is incorrect."), 400
    if len(data.get("new_password") or "") < 8:
        return jsonify(error="New password must be at least 8 characters."), 400
    current_user.set_password(data["new_password"])
    db.session.commit()
    return jsonify(message="Password changed.")


@bp.get("/users/<username>")
def public_profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    stories = [story_card(s) for s in user.stories if s.status in {"published", "completed"} and any(c.status == "published" for c in s.chapters)]
    return jsonify(
        user=user_public(user),
        stories=stories,
        stats={
            "stories": len(stories),
            "chapters": sum(s["published_chapter_count"] for s in stories),
            "words": sum(s["word_count"] for s in stories),
        },
    )
