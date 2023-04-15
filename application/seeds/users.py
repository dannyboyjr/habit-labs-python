from application.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name="Vault", last_name="Boy", username='vault67', email='demo@aa.io', password='password', timezone='America/Denver')
    ryker = User(
        first_name="Ryker", last_name="Kimbro", username='rk95', email='ryker@aa.io', password='password', timezone='America/Denver')
    steve = User(
        first_name="Steve", last_name="Jobs", username='stevejobs', email='sje@aa.io', password='password', timezone='America/Denver')

    db.session.add(demo)
    db.session.add(ryker)
    db.session.add(steve)
    db.session.commit()


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()