from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    dan = User(
        first_name="Dan", last_name="Kimball", username='dannyboyjr', email='dan@aa.io', password='password')
    ryker = User(
        first_name="Ryker", last_name="Kimbro", username='rk95', email='ryker@aa.io', password='password')
    bobbie = User(
        first_name="Bob", last_name="Jobs", username='bobbie', email='bobbie@aa.io', password='password')

    db.session.add(dan)
    db.session.add(ryker)
    db.session.add(bobbie)
    db.session.commit()


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()