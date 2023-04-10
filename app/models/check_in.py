from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class CheckIn(db.Model):
    __tablename__ = 'check_ins'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    habit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('habits.id')))
    todo_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('todos.id')))
    check_in = db.Column(db.Boolean, default=False, nullable=False)
    is_late = db.Column(db.Boolean, nullable=False, default=False)
    amount = db.Column(db.Numeric(10,2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="check_in")
    todo = db.relationship("Todo", back_populates="check_in")
    habit = db.relationship("Habit", back_populates="check_in")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "habit_id": self.habit_id,
            "amount": self.amount,
            "todo_id": self.todo_id,
            "check_in": self.check_in,
            "is_late": self.is_late,
            "created_at": self.created_at
        }