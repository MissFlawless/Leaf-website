from functools import wraps
from flask import jsonify
from flask_jwt_extended import current_user, jwt_required


def author_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if current_user.role != "author":
            return jsonify(error="Authors only."), 403
        return fn(*args, **kwargs)

    return wrapper
