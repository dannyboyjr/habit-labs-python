from app.models import db, IncompleteLog, environment, SCHEMA
from sqlalchemy.sql import text


def seed_incomplete_logs():
    incomplete_log1 = IncompleteLog(
        user_id=1, 
        habit_id=1, 
        amount=20.00, 
        sicko_mode=False
        )

    incomplete_log2 = IncompleteLog(
        user_id=1, 
        todo_id=1, 
        amount=15.00, 
        sicko_mode=False
        )



    db.session.add(incomplete_log1)
    db.session.add(incomplete_log2)
    db.session.commit()


def undo_incomplete_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.incomplete_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM incomplete_logs"))

    db.session.commit()
