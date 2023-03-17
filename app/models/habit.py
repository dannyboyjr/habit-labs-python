from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Habit(db.Model):
    __tablename__ = 'habits'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    amount = db.Column(db.Numeric(10,2), nullable=False)
    cadence = db.Column(db.Integer, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_build = db.Column(db.Boolean, nullable=False, default=True)
    sicko_mode = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="habit")
    check_in = db.relationship('CheckIn', back_populates='habit', cascade='all, delete-orphan')
    incomplete_log = db.relationship('IncompleteLog', back_populates='habit', cascade='all, delete-orphan')
    journal = db.relationship('Journal', back_populates='habit', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id':self.id,
            'user_id': self.user_id,
            "name": self.name,
            "amount": self.amount,
            "cadence": self.cadence,
            "end_date": self.end_date,
            "is_build": self.is_build,
            "sicko_mode": self.sicko_mode,
            "created_at": self.created_at
        }
