from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import IncompleteLog, CheckIn, db
from datetime import datetime, timedelta, timezone
import pytz
from sqlalchemy.sql import func



incomplete_log_routes = Blueprint('incomplete_logs', __name__)

@incomplete_log_routes.route('/', methods=['GET'])
@login_required
def get_this_week_incomplete_logs():
    timezone = pytz.timezone(current_user.timezone)
    now = datetime.now(timezone)

    incomplete_logs = IncompleteLog.query.filter_by(user_id=current_user.id).all()
    # Find the previous Sunday
    # week_start = now - timedelta(days=now.weekday()) # +1 to shift from Monday to Sunday as the start of the week
    # if week_start.date() == now.date(): # If today is Sunday, reset the week_start to today
    #     week_start = now

    # week_end = week_start + timedelta(days=6)

    # logs = IncompleteLog.query.filter(
    #     IncompleteLog.user_id == current_user.id,
    #     IncompleteLog.created_at >= week_start,
    #     IncompleteLog.created_at <= week_end
    # ).all()

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

@incomplete_log_routes.route('/summary', methods=['GET'])
@login_required
def get_summary_incomplete_logs():
    timezone = pytz.timezone(current_user.timezone)
    now = datetime.now(timezone)
    year_start = datetime(now.year, 1, 1, tzinfo=timezone)
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone)
    week_start = now - timedelta(days=now.weekday()) # +1 to shift from Monday to Sunday as the start of the week


    week_end = week_start + timedelta(days=6)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone)

    def get_total_amount(start_date, end_date=None):
        if end_date is None:
            end_date = datetime.now(timezone)
        query = IncompleteLog.query.filter(
            IncompleteLog.user_id == current_user.id,
            IncompleteLog.created_at >= start_date,
            IncompleteLog.created_at <= week_end
        )

        return sum(log.amount for log in query.all())
    


    total_amount_lost = get_total_amount(datetime.min.replace(tzinfo=timezone))
    total_year_lost = get_total_amount(year_start)
    total_month_lost = get_total_amount(month_start)
    total_week_lost = get_total_amount(week_start)
    total_today_lost = get_total_amount(today_start, datetime.now(timezone))
    return jsonify({
        "total_lost_all_time": float(total_amount_lost),
        "total_lost_year": float(total_year_lost),
        "total_lost_month": float(total_month_lost),
        "total_lost_week": float(total_week_lost),
        "total_lost_today": float(total_today_lost),
    })
