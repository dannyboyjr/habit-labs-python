from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Journal, Habit, Todo, CheckIn, IncompleteLog, db
from datetime import datetime, date
from sqlalchemy import func


journal_routes = Blueprint('journal', __name__)



@journal_routes.route('/', methods=['GET'])
@login_required
def get_all_journals():
    """
    GET: ALL JOURNAL ENTRIES FOR HABITS AND TODOS
    """
    all_journals = Journal.query.filter_by(user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in all_journals])



@journal_routes.route('/habits/<int:habit_id>/', methods=['GET'])
@login_required
def get_all_journals_by_habit_id(habit_id):
    """
    GET: ALL JOURNAL ENTRIES BY HABIT_ID
    """
    journals = Journal.query.filter_by(habit_id=habit_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])



@journal_routes.route('/todos/<int:todo_id>/', methods=['GET'])
@login_required
def get_all_journals_by_todo_id(todo_id):
    """
    GET: ALL JOURNAL ENTRIES BY TODO_ID
    """
    journals = Journal.query.filter_by(todo_id=todo_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])





@journal_routes.route('/', methods=['POST'])
@login_required
def create_journal():
    """
    POST: CREATE A NEW JOURNAL ENTRY
    """
    data = request.get_json()
    habit_id = data.get('habit_id')
    todo_id = data.get('todo_id')

    if habit_id:
        todo_id = None
    if todo_id:
        habit_id = None


    if habit_id is not None and todo_id is not None:
        return jsonify({'error': 'Cannot specify both habit_id and todo_id.'}), 400

    if habit_id is None and todo_id is None:
        return jsonify({'error': 'Must specify either habit_id or todo_id.'}), 400

    journal = Journal(
        user_id=current_user.id,
        habit_id=habit_id,
        todo_id=todo_id,
        why_missed=data.get('why_missed'),
        future_action=data.get('future_action'),
    )

    db.session.add(journal)
    db.session.commit()

    return jsonify(journal.to_dict())


@journal_routes.route('/<int:journal_id>/', methods=['PUT'])
@login_required
def edit_journal_by_id(journal_id):
    """
    EDIT: A JOURNAL ENTRY BY ID
    """
    data = request.get_json()

    journal = Journal.query.filter_by(id=journal_id, user_id=current_user.id).first()

    if journal is None:
        return jsonify({'error': 'Journal entry not found.'}), 404

    habit_id = data.get('habit_id')
    todo_id = data.get('todo_id')

    if habit_id:
        todo_id = None
    if todo_id:
        habit_id = None

    if habit_id is not None and todo_id is not None:
        return jsonify({'error': 'Cannot specify both habit_id and todo_id.'}), 400

    if habit_id is None and todo_id is None:
        return jsonify({'error': 'Must specify either habit_id or todo_id.'}), 400

    journal.habit_id = habit_id
    journal.todo_id = todo_id
    journal.why_missed = data.get('why_missed')
    journal.future_action = data.get('future_action')

    db.session.commit()

    return jsonify(journal.to_dict())


@journal_routes.route('/<int:journal_id>/', methods=['DELETE'])
@login_required
def delete_journal_by_id(journal_id):
    """
    DELETE: JOURNAL ENTRY BY ID
    """
    journal = Journal.query.filter_by(id=journal_id, user_id=current_user.id).first()

    if journal is None:
        return jsonify({'error': 'Journal entry not found.'}), 404

    db.session.delete(journal)
    db.session.commit()

    return jsonify({'message': 'Journal entry successfully deleted.'})