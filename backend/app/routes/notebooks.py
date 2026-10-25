from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from app.extensions import db
from app.models import MoodItem, Note, Notebook, Story
from app.utils.security import author_required
from app.utils.uploads import delete_image, save_image

bp = Blueprint("notebooks", __name__)


def nb_json(nb):
    return {
        "id": nb.id,
        "title": nb.title,
        "story_id": nb.story_id,
        "notes": [note_json(n) for n in sorted(nb.notes, key=lambda n: (not n.pinned, n.updated_at), reverse=False)],
        "mood_items": [mood_json(m) for m in nb.mood_items],
        "updated_at": nb.updated_at.isoformat(),
    }


def note_json(note):
    return {"id": note.id, "title": note.title, "content": note.content, "color": note.color, "pinned": note.pinned, "updated_at": note.updated_at.isoformat()}


def mood_json(item):
    value = f"/uploads/{item.value}" if item.type == "image" and not item.value.startswith(("http://", "https://", "/uploads/")) else item.value
    return {"id": item.id, "type": item.type, "value": value, "caption": item.caption, "position": item.position}


def owned_notebook(notebook_id):
    nb = Notebook.query.get_or_404(notebook_id)
    if nb.user_id != current_user.id:
        return None
    return nb


@bp.get("/notebooks")
@author_required
def notebooks():
    return jsonify(items=[nb_json(n) for n in Notebook.query.filter_by(user_id=current_user.id).order_by(Notebook.updated_at.desc()).all()])


@bp.post("/notebooks")
@author_required
def create_notebook():
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="Notebook title is required."), 400
    story_id = data.get("story_id")
    if story_id and not Story.query.filter_by(id=story_id, author_id=current_user.id).first():
        return jsonify(error="Story does not belong to you."), 403
    nb = Notebook(title=title, story_id=story_id, user_id=current_user.id)
    db.session.add(nb)
    db.session.commit()
    return jsonify(notebook=nb_json(nb)), 201


@bp.put("/notebooks/<int:notebook_id>")
@author_required
def update_notebook(notebook_id):
    nb = owned_notebook(notebook_id)
    if not nb:
        return jsonify(error="You cannot edit this notebook."), 403
    nb.title = (request.get_json().get("title") or nb.title).strip()
    db.session.commit()
    return jsonify(notebook=nb_json(nb))


@bp.delete("/notebooks/<int:notebook_id>")
@author_required
def delete_notebook(notebook_id):
    nb = owned_notebook(notebook_id)
    if not nb:
        return jsonify(error="You cannot delete this notebook."), 403
    for item in nb.mood_items:
        if item.type == "image" and not item.value.startswith(("http://", "https://")):
            delete_image(item.value)
    db.session.delete(nb)
    db.session.commit()
    return jsonify(message="Notebook deleted.")


@bp.post("/notebooks/<int:notebook_id>/notes")
@author_required
def create_note(notebook_id):
    nb = owned_notebook(notebook_id)
    if not nb:
        return jsonify(error="You cannot edit this notebook."), 403
    data = request.get_json() or {}
    note = Note(title=(data.get("title") or "Untitled").strip(), content=data.get("content") or "", color=data.get("color") or "#FDF8EC", pinned=bool(data.get("pinned")), notebook_id=nb.id)
    db.session.add(note)
    db.session.commit()
    return jsonify(note=note_json(note)), 201


@bp.put("/notebooks/<int:notebook_id>/notes/<int:note_id>")
@author_required
def update_note(notebook_id, note_id):
    nb = owned_notebook(notebook_id)
    note = Note.query.filter_by(id=note_id, notebook_id=notebook_id).first_or_404()
    if not nb:
        return jsonify(error="You cannot edit this note."), 403
    data = request.get_json() or {}
    for field in ["title", "content", "color", "pinned"]:
        if field in data:
            setattr(note, field, data[field])
    db.session.commit()
    return jsonify(note=note_json(note))


@bp.delete("/notebooks/<int:notebook_id>/notes/<int:note_id>")
@author_required
def delete_note(notebook_id, note_id):
    nb = owned_notebook(notebook_id)
    note = Note.query.filter_by(id=note_id, notebook_id=notebook_id).first_or_404()
    if not nb:
        return jsonify(error="You cannot delete this note."), 403
    db.session.delete(note)
    db.session.commit()
    return jsonify(message="Note deleted.")


@bp.post("/notebooks/<int:notebook_id>/mood-items")
@author_required
def create_mood(notebook_id):
    nb = owned_notebook(notebook_id)
    if not nb:
        return jsonify(error="You cannot edit this notebook."), 403
    data = request.get_json() or {}
    kind = data.get("type")
    if kind not in {"image", "color", "text", "link"}:
        return jsonify(error="Choose a valid mood item type."), 400
    value = (data.get("value") or "").strip()
    if not value:
        return jsonify(error="Mood item value is required."), 400
    item = MoodItem(type=kind, value=value, caption=data.get("caption") or "", notebook_id=nb.id, position=len(nb.mood_items) + 1)
    db.session.add(item)
    db.session.commit()
    return jsonify(item=mood_json(item)), 201


@bp.post("/notebooks/<int:notebook_id>/mood-items/image")
@author_required
def create_mood_image(notebook_id):
    nb = owned_notebook(notebook_id)
    if not nb:
        return jsonify(error="You cannot edit this notebook."), 403
    try:
        filename = save_image(request.files.get("image"))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    item = MoodItem(type="image", value=filename, caption=request.form.get("caption", ""), notebook_id=nb.id, position=len(nb.mood_items) + 1)
    db.session.add(item)
    db.session.commit()
    return jsonify(item=mood_json(item)), 201


@bp.put("/notebooks/<int:notebook_id>/mood-items/<int:item_id>")
@author_required
def update_mood(notebook_id, item_id):
    nb = owned_notebook(notebook_id)
    item = MoodItem.query.filter_by(id=item_id, notebook_id=notebook_id).first_or_404()
    if not nb:
        return jsonify(error="You cannot edit this mood item."), 403
    data = request.get_json() or {}
    item.caption = data.get("caption", item.caption)
    if "position" in data:
        item.position = int(data["position"])
    db.session.commit()
    return jsonify(item=mood_json(item))


@bp.delete("/notebooks/<int:notebook_id>/mood-items/<int:item_id>")
@author_required
def delete_mood(notebook_id, item_id):
    nb = owned_notebook(notebook_id)
    item = MoodItem.query.filter_by(id=item_id, notebook_id=notebook_id).first_or_404()
    if not nb:
        return jsonify(error="You cannot delete this mood item."), 403
    if item.type == "image" and not item.value.startswith(("http://", "https://")):
        delete_image(item.value)
    db.session.delete(item)
    db.session.commit()
    return jsonify(message="Mood item deleted.")
