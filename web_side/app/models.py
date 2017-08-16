from app import db


class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	nickname = db.Column(db.String(64), unique=True)
	email = db.Column(db.String(120), unique=True)
	password = db.Column(db.String(100))
