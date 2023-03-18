from flask import Blueprint, jsonify
from app.models import Todo, Journal
from flask_login import login_required, current_user
from datetime import datetime

todo_routes = Blueprint('todo', __name__)


@todo_routes.route('/current', methods=['GET'])
@login_required
def get_current_user_todos():
    """
    Get all todos of current user
    """
    user_id = current_user.id
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify({'user todos': [todo.to_dict() for todo in todos]})




@todo_routes.route('/<int:todo_id>/journals', methods=['GET'])
@login_required
def get_all_journals_by_todo_id(todo_id):
    """
    Get all journal entries by todos id
    """
    journals = Journal.query.filter_by(todo_id=todo_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])