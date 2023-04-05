from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Habit,Journal, CheckIn, db
from datetime import datetime, date, timedelta
from pytz import timezone
import pytz
from sqlalchemy import func

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

    end_date = None
    cadence = None
    if data.get('is_build') == True:
        cadence = data.get('cadence')
        end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')

    habit.name = data.get('name', habit.name)
    habit.amount = data.get('amount', habit.amount)
    cadence=cadence,
    end_date=end_date,
    habit.is_build = data.get('is_build', habit.is_build)
    habit.sicko_mode = data.get('sicko_mode', habit.sicko_mode)

    db.session.commit()
    return jsonify(habit.to_dict()), 200


@habit_routes.route('/<int:habit_id>', methods=["DELETE"])
@login_required
def delete_habit(habit_id):
    """
    DELETE: HABIT BY HABIT_ID
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
    



@habit_routes.route('/<int:habit_id>/checkin', methods=["POST"])
@login_required
def create_habit_checkin(habit_id):
    """
    POST: CREATE A CHECKIN FOR HABIT
    """
    habit = Habit.query.filter_by(id=habit_id, user_id=current_user.id).first()
    if not habit:
        return jsonify({'error': 'Habit not found'}), 404
    
    today = datetime.utcnow().date()
    existing_checkin = CheckIn.query.filter_by(habit_id=habit_id, user_id=current_user.id).filter(func.DATE(CheckIn.created_at)==today).first()
    if existing_checkin:
        return jsonify({'error': 'A check-in for this habit already exists today'}), 400
    

    check_in = CheckIn(
        user_id=current_user.id,
        habit_id=habit_id,
        check_in=True,
        is_late=False,
        created_at=datetime.utcnow(),
    )

    db.session.add(check_in)
    db.session.commit()

    return jsonify(check_in.to_dict()), 201



@habit_routes.route('/checkins', methods=["GET"])
@login_required
def get_current_user_checkins():
    """
    GET: ALL CHECK-INS OF CURRENT_USER.ID for today
    """
    user_id = current_user.id
    user_timezone = pytz.timezone(current_user.timezone)
    today_local = datetime.now(user_timezone).date()
    all_checkins = CheckIn.query.filter_by(user_id=user_id).all()

    # existing_checkin = CheckIn.query.filter_by(user_id=user_id).filter(func.DATE(func.convert_tz(CheckIn.created_at,'+00:00',current_user.timezone))==today_local).all()
    existing_checkin = [
        checkin for checkin in all_checkins
        if checkin.created_at.replace(tzinfo=pytz.UTC).astimezone(user_timezone).date() == today_local
    ]
    return jsonify([checkin.to_dict() for checkin in existing_checkin])


@habit_routes.route('/checkins/<int:habit_id>', methods=["DELETE"])
@login_required
def delete_checkin_by_habit_id(habit_id):
    """
    DELETE: A CHECK-IN (only searches todays checkins) BY HABIT_ID
    """
    user_id = current_user.id
    user_timezone = pytz.timezone(current_user.timezone)
    today_local = datetime.now(user_timezone).date()
    checkin = CheckIn.query.filter_by(user_id=user_id, habit_id=habit_id).first()

    if not checkin:
        return jsonify({"error": "Check-in not found"}), 404

    if checkin.created_at.replace(tzinfo=pytz.UTC).astimezone(user_timezone).date() != today_local:
        return jsonify({"error": "Check-in is not for today"}), 400

    db.session.delete(checkin)
    db.session.commit()

    return jsonify({"message": "Check-in deleted successfully"})



@habit_routes.route('/<int:habit_id>/checkins', methods=["GET"])
@login_required
def get_habit_checkins(habit_id):
    """
    GET: ALL CHECK-INS FOR A SPECIFIC HABIT
    """
    habit = Habit.query.filter_by(id=habit_id, user_id=current_user.id).first()
    if not habit:
        return jsonify({'error': 'Habit not found'}), 404

    checkins = CheckIn.query.filter_by(habit_id=habit_id).all() 
    return jsonify([checkin.to_dict() for checkin in checkins])












