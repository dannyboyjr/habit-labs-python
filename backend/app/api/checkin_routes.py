from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import CheckIn, db
from datetime import datetime, timedelta, timezone
import pytz
from sqlalchemy.sql import func



check_in_routes = Blueprint('check_in_routes', __name__)


@check_in_routes.route('/all_this_week', methods=['GET'])
@login_required
def get_this_weeks_check_ins():
    timezone = pytz.timezone(current_user.timezone)
    now = datetime.now(timezone)

    # Find the previous Sunday
    week_start = now - timedelta(days=now.weekday() + 1) # +1 to shift from Monday to Sunday as the start of the week
    if week_start.date() == now.date(): # If today is Sunday, reset the week_start to today
        week_start = now

    week_end = week_start + timedelta(days=6)

    checkins = CheckIn.query.filter(
        CheckIn.user_id == current_user.id,
        CheckIn.created_at >= week_start,
        CheckIn.created_at <= week_end
    ).all()

    return jsonify([checkin.to_dict() for checkin in checkins])


@check_in_routes.route('/summary', methods=['GET'])
@login_required
def get_summary_check_ins():
    timezone = pytz.timezone(current_user.timezone)
    now = datetime.now(timezone)
    year_start = datetime(now.year, 1, 1, tzinfo=timezone)
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone)
    week_start = now - timedelta(days=now.weekday())

    week_end = week_start + timedelta(days=6)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone)

    def get_total_amount(start_date, end_date=None):
        if end_date is None:
            end_date = datetime.now(timezone)
        query = CheckIn.query.filter(
            CheckIn.user_id == current_user.id,
            CheckIn.created_at >= start_date,
            CheckIn.created_at <= week_end
        )
        # if end_date:
        #     query = query.filter(CheckIn.created_at <= end_date)

        return sum(log.amount for log in query.all())

    total_amount = get_total_amount(datetime.min.replace(tzinfo=timezone))
    total_year = get_total_amount(year_start)
    total_month = get_total_amount(month_start)
    total_week = get_total_amount(week_start)
    total_today = get_total_amount(today_start, datetime.now(timezone))
    return jsonify({
        "total_saved_all_time": float(total_amount),
        "total_saved_year": float(total_year),
        "total_saved_month": float(total_month),
        "total_saved_week": float(total_week),
        "total_saved_today": float(total_today),
    })
