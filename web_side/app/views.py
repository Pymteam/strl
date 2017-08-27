from flask import render_template, redirect, url_for, g, flash, request, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from . import app, lm, db
from .forms import SignUpForm, SignInForm
from .models import User, Project, World
from .jsoner import project_json_from_user


# загружает пользователя
@lm.user_loader
def load_user(id):
	return User.query.get(int(id))


@app.before_request
def before_request():
	# flask_login предоставялет инфу о текущем пользователе перед каждым запросом
	# теперь текущий пользователь доступен и внутри шаблонов
	g.user = current_user


@app.route('/')
@app.route('/index')
@login_required
def index():
	return render_template("index.html")


@app.route('/sign_in', methods=['GET', 'POST'])
def sign_in():
	# если пользователь уже вошёл, то перенаправляем в index
	if g.user is not None and g.user.is_authenticated:
		return redirect(url_for('index'))
	form = SignInForm()
	# принимаем email и password
	# ищем пользователя с прнятым email и сравниваем с password
	# если произошли ошибки, сообщаем о них
	if form.validate_on_submit():
		user = User.query.filter_by(email=form.email.data).first()
		if user is None or user.is_correct_password(form.password.data) is not True:
			flash('Your details are incorrect. Please try again.')
			return redirect(url_for('sign_in'))

		login_user(user)
		flash('Welcome')
		return redirect(url_for('index'))
	return render_template("sign_in.html", form=form)


@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
	# если пользователь уже вошёл, то перенаправляем в index
	if g.user is not None and g.user.is_authenticated:
		return redirect(url_for('index'))
	form = SignUpForm()
	if form.validate_on_submit():
		# если пользователь с таким имейлом уже есть, то сообщаем об этом
		if User.query.filter_by(email=form.email.data).count() != 0:
			flash('This email is already in use.')
			return redirect(url_for('sign_up'))

		# регистрируем пользователя и перенаправляем в index
		user = User(nickname=form.nickname.data, email=form.email.data, password=form.password.data)
		db.session.add(user)
		db.session.commit()
		flash('Thank you for signing up!')
		return redirect(url_for('sign_up'))
	return render_template("sign_up.html", form=form)


@app.route('/sign_out')
@login_required
def sign_out():
	logout_user()
	return redirect(url_for('index'))


@app.route('/world_editor')
@login_required
def world_editor():
	return render_template('world_editor.html')


@app.route('/projects')
@login_required
def projects():
	#TO DO: добавить поддержку передачи projects_json
	project_json = project_json_from_user(g.user)
	return render_template('projects.html')


@app.route('/projects/add')
@login_required
def add_project():
	# TO DO: проверить на ошибки, входя на этот юрл вручную
	error = 0
	name = request.args.get('name', 'project', type=str)
	project = Project(name=name, owner=g.user)
	db.session.add(project)
	db.commit()
	return jsonify(error=error, name=project.name, id=project.id)


@app.route('/projects/edit')
@login_required
def edit_project():
	error = 0
	id = request.args.get('id', -1, type=int)
	new_name = request.args.get('new_name', 'new_name', type=str)

	project = Project.query.filter_by(id=id).first()
	project.name = new_name
	db.session.commit()
	return jsonify(error=error, new_name=project.name, id=project.id)


@app.route('/projects/delete')
@login_required
def delete_project():
	error = 0
	id = request.args.get('id', -1, type=int)

	project = Project.query.filter_by(id=id).first()
	db.session.delete(project)
	db.session.commit()
	return jsonify(error=error)


@app.route('/projects/add_world')
@login_required
def add_world():
	error = 0
	project_id = request.args.get('project_id', -1, type=int)
	name = request.args.get('name', 'world', type=str)

	project = Project.query.filter_by(id=project_id).first()
	world = World(name=name, owner=project)
	db.session.add(world)
	db.session.commit()
	return jsonify(error=error, name=world.name, id=world.id)


@app.route('/projects/edit_world')
@login_required
def edit_world():
	error = 0
	id = request.args.get('id', -1, type=int)
	new_name = request.args.get('new_name', 'new_name', type=str)

	world = World.query.filter_by(id=id).first()
	world.name = new_name
	db.session.commit()
	return jsonify(error=error, new_name=world.name, id=world.id)


@app.route('/projects/delete_world')
@login_required
def delete_world():
	error = 0
	id = request.args.get('id', -1, type=int)

	world = World.query.filter_by(id=id).first()
	db.session.delete(world)
	db.session.commit()
	return jsonify(error=error)
