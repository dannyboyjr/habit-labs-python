from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class Todo(db.Model, UserMixin):
    __tablename__ = 'todos'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    amount = db.Column(db.Numeric(10,2), nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    late_fee = db.Column(db.Numeric(10,2), nullable=False)
    sicko_mode = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="todo")
    check_in = db.relationship('Check_In', back_populates='todo', cascade='all, delete-orphan')
    incomplete_log = db.relationship('Incomplete_Log', back_populates='todo', cascade='all, delete-orphan')
    journal = db.relationship('Journal', back_populates='todo', cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id':self.id,
            'user_id': self.user_id,
            "name": self.name,
            "amount": self.amount,
            "due_date": self.due_date,
            "late_fee": self.late_fee,
            "sicko_mode": self.sicko_mode
        }
