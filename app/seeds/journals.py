from app.models import db, Journal, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_journals():
    # Hardcoded Journal entries
    journal1 = Journal(user_id=1, habit_id=1, todo_id=None, why_missed="I was busy at work. I didn't pencil out time", future_action="I will block off time in my calendar today", created_at=datetime.utcnow())
    journal2 = Journal(user_id=1, habit_id=None, todo_id=1, why_missed="I forgot about it.", future_action="I will set a reminder.", created_at=datetime.utcnow())
    

    # Add Journal entries to the session
    db.session.add(journal1)
    db.session.add(journal2)

    # Commit the changes
    db.session.commit()

def undo_journals():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.journals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM journals"))

    db.session.commit()