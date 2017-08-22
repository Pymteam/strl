from sqlalchemy.ext.hybrid import hybrid_property
from . import bcrypt, db



class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	nickname = db.Column(db.String(45))
	email = db.Column(db.String(45), unique=True)
	_password = db.Column(db.String(128))
	projects = db.relationship('Project', backref='owner', lazy='dynamic')

	@property
	def is_authenticated(self):
		return True

	@property
	def is_active(self):
		return True

	@property
	def is_anonymous(self):
		return False

	def get_id(self):
		return str(self.id)

	@hybrid_property
	def password(self):
		return self._password

	@password.setter
	def _set_password(self, plaintext):
		self._password = bcrypt.generate_password_hash(plaintext)

	def is_correct_password(self, plaintext):
		return bcrypt.check_password_hash(self._password, plaintext)

	def __repr__(self):
		# для корректного отображения при отладке
		return 'Nickname: {}, email: {}'.format(self.nickname, self.email)


class Project(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	name = db.Column(db.String(45))
	worlds = db.relationship('World', backref='owner', lazy='dynamic')


class World(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	project_id = db.Column(db.Integer, db.ForeignKey('project.id'))
	name = db.Column(db.String(45))

