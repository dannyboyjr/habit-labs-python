from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Habit,Journal, db
from datetime import datetime

habit_routes = Blueprint('habit', __name__)

#get all habits of current user
@habit_routes.route('/current', methods=["GET"])
@login_required
def get_current_user_habits():
    """
    get all habits of current user
    """
    user_id = current_user.id
    habits = Habit.query.filter_by(user_id=user_id).all() 
    return jsonify([habit.to_dict() for habit in habits])



@habit_routes.route('/<int:habit_id>/journals', methods=['GET'])
@login_required
def get_all_journals_by_habit_id(habit_id):
    """
    Get all journal entries by habit id
    """
    journals = Journal.query.filter_by(habit_id=habit_id, user_id=current_user.id).all()
    return jsonify([journal.to_dict() for journal in journals])