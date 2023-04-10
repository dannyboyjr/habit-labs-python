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