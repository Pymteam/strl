#!flask/bin/python3
import os
import unittest
from config import basedir
from app import app, db
from app.models import User


class TestCase(unittest.TestCase):
	def setUp(self):
		app.config['TESTING'] = True
		app.config['CSRF_ENABLED'] = False
		app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'test.db')
		self.app = app.test_client()
		db.create_all()

	def tearDown(self):
		db.session.remove()
		db.drop_all()

	def test_authentication(self):
		u = User(nickname='nick1', email='nick@mail.ru', password='12345')
		db.session.add(u)
		db.session.commit()
		assert u.is_correct_password('123456') is False
		assert u.is_correct_password('12345')

	def test_not_unique_nickname(self):
		# тест на неуникальность никнейма
		u1 = User(nickname='nick', email='nick@mail.ru', password='12345')
		u2 = User(nickname='nick', email='nick1@mail.ru', password='12345')
		db.session.add(u1)
		db.session.add(u2)
		try:
			db.session.commit()
			assert True
		except:
			assert False


if __name__ == '__main__':
	unittest.main()
