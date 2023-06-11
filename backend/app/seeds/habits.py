from app.models import db, Habit, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta


def seed_habits():

    habit1 = Habit(name="Read 20 minutes daily", user_id=1, amount=20.00, cadence=1, end_date=datetime.utcnow() + timedelta(days=30), is_build=True, sicko_mode=False, created_at=datetime.utcnow())
    habit2 = Habit(name="Code 1 Hours", user_id=1, amount=50.00, cadence=1, end_date=datetime.utcnow() + timedelta(days=66), is_build=True, sicko_mode=False, created_at=datetime.utcnow())

    db.session.add(habit1)
    db.session.add(habit2)
    db.session.commit()


def undo_habits():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.habits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM habits"))
        
    db.session.commit()