from application.models import db, Todo, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta


def seed_todos():
    todo1 = Todo(
        name='Buy groceries', 
        user_id=1, 
        amount=15.00,
        due_date=datetime.utcnow() + timedelta(days=2),
        is_complete=False,
        late_fee=1.00)

    todo2 = Todo(
        name='Finish project', 
        user_id=1, 
        amount=20.00,
        due_date=datetime.utcnow() + timedelta(days=10), 
        is_complete=False,
        late_fee=2.00)

    db.session.add(todo1)
    db.session.add(todo2)
    db.session.commit()


def undo_todos():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.todos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM todos"))

    db.session.commit()