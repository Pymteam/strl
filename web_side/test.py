#!flask/bin/python3
import os
import unittest
from config import basedir
from app import app, db
from app.models import User, Project, World


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

	def test_user_project_relationship(self):
		u1 = User(nickname='nick1', email='nick1@mail.ru', password='12345')
		u2 = User(nickname='nick2', email='nick2@mail.ru', password='12345')
		db.session.add(u1)
		db.session.add(u2)
		db.session.commit()
		p1 = Project(name='pr1', owner=u1)
		p2 = Project(name='pr2', owner=u2)
		p3 = Project(name='pr3', owner=u1)
		db.session.add(p1)
		db.session.add(p2)
		db.session.add(p3)
		db.session.commit()
		assert u1.projects.count() == 2
		assert u2.projects.count() == 1

	def test_project_world_relationship(self):
		u1 = User(nickname='nick', email='nick@mail.ru', password='12345')
		p1 = Project(name='pr1', owner=u1)
		p2 = Project(name='pr2', owner=u1)
		db.session.add(u1)
		db.session.add(p1)
		db.session.add(p2)
		db.session.commit()
		w1 = World(name='world1', owner=p1)
		w2 = World(name='world2', owner=p2)
		w3 = World(name='world3', owner=p1)
		db.session.add(w1)
		db.session.add(w2)
		db.session.add(w3)
		db.session.commit()
		assert p1.worlds.count() == 2
		assert p2.worlds.count() == 1

if __name__ == '__main__':
	unittest.main()
