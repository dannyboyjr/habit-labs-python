from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Incomplete_Log(db.Model, UserMixin):
    __tablename__ = 'incomplete_logs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    habit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('habits.id')))
    todo_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('todos.id')))
    amount = db.Column(db.Numeric(10,2), nullable=False)
    sicko_mode = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="incomplete_log")
    todo = db.relationship("Todo", back_populates="incomplete_log")
    habit = db.relationship("Habit", back_populates="incomplete_log")


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "habit_id": self.habit_id,
            "todo_id": self.todo_id,
            "amount": self.amount,
            "sicko_mode": self.sicko_mode,
            "created_at": self.created_at
        }