from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Task
from datetime import datetime

task_routes = Blueprint("tasks", __name__)

@task_routes.route("/")
@login_required
def get_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify({"tasks": [task.to_dict() for task in tasks]})

@task_routes.route("/", methods=["POST"])
@login_required
def create_task():
    data = request.get_json()
    new_task = Task(
        user_id=current_user.id,
        tarantula_id=data["tarantula_id"],
        name=data["name"],
        description=data.get("description", ""),
        due_date=datetime.fromisoformat(data["due_date"])
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@task_routes.route("/<int:task_id>/complete/", methods=["PUT"])
@login_required
def complete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == current_user.id:
        task.completed = True
        db.session.commit()
        return jsonify(task.to_dict())
    return {"error": "Task not found or unauthorized"}, 404

@task_routes.route("/<int:task_id>/delete/", methods=["DELETE"])
@login_required
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == current_user.id:
        db.session.delete(task)
        db.session.commit()
        return {"message": "Task deleted successfully"}
    return {"error": "Task not found or unauthorized"}, 404

@task_routes.route("/<int:task_id>/reset/", methods=["PUT"])
@login_required
def reset_task_due_date(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == current_user.id:
        task.due_date = datetime.utcnow() + timedelta(days=task.interval_days)
        db.session.commit()
        return jsonify(task.to_dict()), 200
    return {"error": "Task not found or unauthorized"}, 404

@task_routes.route("/<int:task_id>/", methods=["PUT"])
@login_required
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task or task.user_id != current_user.id:
        return {"error": "Task not found or unauthorized"}, 404

    data = request.get_json()
    
    task.name = data.get("name", task.name)
    task.description = data.get("description", task.description)

    due_date_str = data.get("due_date")
    if due_date_str:
        task.due_date = datetime.fromisoformat(due_date_str.replace("Z", ""))

    task.interval_days = data.get("interval_days", task.interval_days)

    db.session.commit()
    return jsonify(task.to_dict()), 200