from flask import Blueprint, jsonify, request
from application.models import Todo, Journal,CheckIn, db
from flask_login import login_required, current_user
from datetime import datetime
from pytz import timezone
import pytz
from sqlalchemy import func

todo_routes = Blueprint('todo', __name__)


@todo_routes.route('/current', methods=['GET'])
@login_required
def get_current_user_todos():
    """
    GET: ALL TODOS OF CURRENT USER
    """
    user_id = current_user.id
    todos = Todo.query.filter_by(user_id=user_id, is_complete=False).all()
    return jsonify([todo.to_dict() for todo in todos])




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
        due_date=datetime.strptime(data.get('due_date'), '%Y-%m-%d'),
        sicko_mode=data.get('sicko_mode', False),
    )
    db.session.add(new_todo)
    db.session.commit()

    return jsonify(new_todo.to_dict())




@todo_routes.route('/<int:todo_id>', methods=["PUT"])
@login_required
def edit_todo(todo_id):
    """
    PUT: EDIT TODO
    """
    todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    
    #rejects user from editing todo when in sicko mode
    if todo.sicko_mode:
        return jsonify({'error': 'You cannot edit a sicko mode Todo'}), 403


    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing request body'}), 400

    todo.name = data.get('name', todo.name)
    todo.amount = data.get('amount', todo.amount)
    todo.late_fee = data.get('late_fee', todo.late_fee)
    todo.due_date = datetime.strptime(data.get('due_date'), '%Y-%m-%d')
    todo.sicko_mode = data.get('sicko_mode', todo.sicko_mode)

    db.session.commit()
    return jsonify(todo.to_dict()), 200



@todo_routes.route('/<int:todo_id>', methods=["DELETE"])
@login_required
def delete_todo(todo_id):
    """
    DELETE: TODO BY TODO_ID
    """
    todo = Todo.query.get(todo_id)

    if todo:
        if todo.user_id != current_user.id:
            return jsonify({"error": "unauthorized"}), 403 
        if todo.sicko_mode:
            return jsonify({"error": "You cannot delete a sicko mode Todo"}), 403 
        else:
            db.session.delete(todo)
            db.session.commit()
            return jsonify({"message": "Todo deleted successfully"}), 200
    else:
        return jsonify({"error": "Todo not found"}), 404


@todo_routes.route('/<int:todo_id>/complete', methods=["PATCH"])
@login_required
def complete_todo(todo_id):
    """
    PATCH: Mark Todo as complete
    """
    todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    todo.is_complete = True

    # Create a new CheckIn instance
    check_in = CheckIn(
        user_id=current_user.id,
        todo_id=todo.id,
        check_in=True,
        amount=todo.amount
    )

    # Add the CheckIn instance to the session and commit the changes
    db.session.add(check_in)
    db.session.commit()

    return jsonify(todo.to_dict()), 201



    