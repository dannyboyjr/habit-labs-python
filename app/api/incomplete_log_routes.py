from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Habit,Journal, IncompleteLog, db
from sqlalchemy import func
from datetime import datetime, timedelta
import pytz

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


@incomplete_log_routes.route('/summary', methods=['GET'])
@login_required
def get_summary_incomplete_logs():
   timezone = pytz.timezone(current_user.timezone)
   now = datetime.now(timezone)
   year_start = datetime(now.year, 1, 1, tzinfo=timezone)
   month_start = datetime(now.year, now.month, 1, tzinfo=timezone)
   week_start = now - timedelta(days=now.weekday())
   today_start = datetime(now.year, now.month, now.day, tzinfo=timezone)


   def get_total_amount(start_date, end_date=None):
       query = IncompleteLog.query.filter(
           IncompleteLog.user_id == current_user.id,
           IncompleteLog.created_at >= start_date
       )
       if end_date:
           query = query.filter(IncompleteLog.created_at <= end_date)


       return sum(log.amount for log in query.all())


   total_amount = get_total_amount(datetime.min.replace(tzinfo=timezone))
   total_year = get_total_amount(year_start)
   total_month = get_total_amount(month_start)
   total_week = get_total_amount(week_start)
   total_today = get_total_amount(today_start, datetime.now(timezone))


   return jsonify({
       "total_amount": float(total_amount),
       "total_year": float(total_year),
       "total_month": float(total_month),
       "total_week": float(total_week),
       "total_today": float(total_today),
   })