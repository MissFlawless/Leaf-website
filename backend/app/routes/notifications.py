from flask import Blueprint, jsonify
from flask_jwt_extended import current_user, jwt_required
from app.extensions import db
from app.models import Notification
from app.utils.serializers import notification_json

bp = Blueprint("notifications", __name__)


@bp.get("/notifications")
@jwt_required()
def notifications():
    items = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).limit(50).all()
    return jsonify(items=[notification_json(item) for item in items], unread_count=sum(not item.read for item in items))


@bp.put("/notifications/read")
@jwt_required()
def mark_notifications_read():
    Notification.query.filter_by(user_id=current_user.id, read=False).update({"read": True})
    db.session.commit()
    return jsonify(message="Notifications marked as read.")
