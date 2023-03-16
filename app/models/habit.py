from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Habit(db.Model, UserMixin):
    __tablename__ = 'habits'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    amount = db.Column(db.Numeric(10,2), nullable=False)
    cadence = db.Column(db.Integer, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    isBuild = db.Column(db.Boolean, nullable=False, default=True)
    sicko_mode = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="habit")


    def to_dict(self):
        return {
            'id':self.id,
            'user_id': self.user_id,
            "name": self.name,
            "amount": self.amount,
            "due_date": self.due_date,
            "late_fee": self.late_fee
        }
