from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Habit,Journal, db
from datetime import datetime

habit_routes = Blueprint('habit', __name__)


@habit_routes.route('/current', methods=["GET"])
@login_required
def get_current_user_habits():
    """
    GET: ALL HABITS OF CURRENT_USER.ID
    """
    user_id = current_user.id
    habits = Habit.query.filter_by(user_id=user_id).all() 
    return jsonify([habit.to_dict() for habit in habits])


@habit_routes.route('/<int:habit_id>', methods=["GET"])
@login_required
def get_habit_by_id(habit_id):
    """
    GET: HABIT BY HABIT_ID
    """
    habit = Habit.query.filter_by(id=habit_id, user_id=current_user.id).first()
    if habit:
        return jsonify(habit.to_dict())
    else:
        return jsonify({"error": "Habit not found"}), 404



@habit_routes.route('/<int:habit_id>/journals', methods=['GET'])
@login_required
def get_all_journals_by_habit_id(habit_id):
    """
    GET: ALL JOURNAL ENTRIES BY HABIT_ID
    """
    journals = Journal.query.filter_by(habit_id=habit_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])



@habit_routes.route('/', methods=["POST"])
@login_required
def create_habit():
    """
    POST: CREATE HABIT
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "missing request body"}), 400

    
    end_date = None
    cadence = None
    if data.get('is_build') == True:
        cadence = data.get('cadence')
        end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')

    new_habit = Habit(
        name=data.get('name'),
        user_id=current_user.id,
        amount=data.get('amount'),
        cadence=cadence,
        end_date=end_date,
        is_build=data.get('is_build', True),
        sicko_mode=data.get('sicko_mode', False),
    )

    

    db.session.add(new_habit)
    db.session.commit()
    return jsonify(new_habit.to_dict()), 201



@habit_routes.route('/<int:habit_id>', methods=["PUT"])
@login_required
def edit_habit(habit_id):
    """
    PUT: EDIT HABIT
    """
    habit = Habit.query.filter_by(id=habit_id, user_id=current_user.id).first()
    if not habit:
        return jsonify({'error': 'Habit not found'}), 404
    if habit.sicko_mode:
        return jsonify({'error': 'you are in Sicko Mode. Cannot edit habit. Must complete task'}), 403


    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing request body'}), 400

    habit.name = data.get('name', habit.name)
    habit.amount = data.get('amount', habit.amount)
    habit.cadence = data.get('cadence', habit.cadence)
    habit.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
    habit.is_build = data.get('is_build', habit.is_build)
    habit.sicko_mode = data.get('sicko_mode', habit.sicko_mode)

    db.session.commit()
    return jsonify(habit.to_dict()), 200


@habit_routes.route('/<int:habit_id>', methods=["DELETE"])
@login_required
def delete_habit(habit_id):
    """
    DELETE: HABIT BY TODO_ID
    """
    habit = Habit.query.get(habit_id)

    if habit:
        if habit.user_id != current_user.id:
            return jsonify({"error": "unauthorized"}), 403 
        if habit.sicko_mode:
            return jsonify({"error": "You cannot delete a sicko mode habit"}), 403 
        else:
            db.session.delete(habit)
            db.session.commit()
            return jsonify({"message": "habit deleted successfully"}), 200
    else:
        return jsonify({"error": "habit not found"}), 404