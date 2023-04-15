from application.models import db, CheckIn, environment, SCHEMA
from sqlalchemy.sql import text


def seed_check_ins():
    check_in1 = CheckIn(
        user_id=1, 
        habit_id=1, 
        amount=20.00,
        check_in=True, 
        is_late=False
        )
    check_in2 = CheckIn(
        user_id=1, 
        todo_id=1, 
        amount=10.00,
        check_in=True, 
        is_late=False
        )
    check_in3 = CheckIn(
        user_id=1, 
        todo_id=1, 
        amount=20.00,
        check_in=True, 
        is_late=True
        )
    check_in4 = CheckIn(
        user_id=1, 
        habit_id=1, 
        amount=20.00,
        check_in=True, 
        is_late=True
        )

    db.session.add(check_in1)
    db.session.add(check_in2)
    db.session.add(check_in3)
    db.session.add(check_in4)
    db.session.commit()


def undo_check_ins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.check_ins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM check_ins"))

    db.session.commit()