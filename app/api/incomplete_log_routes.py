from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Habit,Journal, IncompleteLog, db
from sqlalchemy import func

incomplete_log_routes = Blueprint('incomplete_logs', __name__)

@incomplete_log_routes.route('/', methods=['GET'])
@login_required
def get_all_incomplete_logs():
    incomplete_logs = IncompleteLog.query.all()
    return jsonify([log.to_dict() for log in incomplete_logs])


@incomplete_log_routes.route('/', methods=['POST'])
def create_incomplete_log():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing request body'}), 400
    
    new_log = IncompleteLog(
        user_id=current_user.id,
        habit_id=data.get('habit_id', None),
        todo_id=data.get('todo_id', None),
        amount=data['amount'],
        sicko_mode=data['sicko_mode']
    )
    
    db.session.add(new_log)
    db.session.commit()
    
    return jsonify(new_log.to_dict())