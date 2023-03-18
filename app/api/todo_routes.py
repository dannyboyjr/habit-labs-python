from flask import Blueprint, jsonify, request, db
from app.models import Todo, Journal
from flask_login import login_required, current_user
from datetime import datetime

todo_routes = Blueprint('todo', __name__)


@todo_routes.route('/current', methods=['GET'])
@login_required
def get_current_user_todos():
    """
    GET: ALL TODOS OF CURRENT USER
    """
    user_id = current_user.id
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify({'user todos': [todo.to_dict() for todo in todos]})




@todo_routes.route('/<int:todo_id>/journals', methods=['GET'])
@login_required
def get_all_journals_by_todo_id(todo_id):
    """
    GET: ALL JOURNAL ENTIRES BY TODO_ID
    """
    journals = Journal.query.filter_by(todo_id=todo_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])



@todo_routes.route('/<int:todo_id>', methods=['GET'])
@login_required
def get_todo_by_id(todo_id):
    """
    GET: TODO BY TODO_ID
    """
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify(message="Todo not found"), 404
    if todo.user_id != current_user.id:
        return jsonify(message="Unauthorized"), 403

    return jsonify(todo.to_dict()), 200

@todo_routes.route('/', methods=['POST'])
@login_required
def create_todo():
    """
    POST: CREAT NEW TODO 
    """
    data = request.get_json()
    if not data:
        return jsonify(message="No input data provided"), 400
    if not all(key in data for key in ('name', 'amount', 'due_date', 'late_fee')):
        return jsonify(message="Missing required fields"), 400

    new_todo = Todo(
        name = data['name'],
        user_id = current_user.id,
        amount = data['amount'],
        late_fee = data['late_fee'],
        due_date=datetime.strptime(data.get('end_date'), '%Y-%m-%d'),
        sicko_mode=data.get('sicko_mode', False),
    )

    db.session.commit(new_todo)
    return jsonify(new_todo.to_dict())
