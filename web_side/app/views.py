from flask import render_template, redirect, url_for, g, flash
from flask_login import current_user
from . import app, lm, db
from .forms import SignUpForm
from .models import User


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
def index():
	return render_template("index.html")


@app.route('/sign_in', methods=['GET', 'POST'])
def sign_in():

	return render_template("sign_in.html")


@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
	# если пользователь уже вошёл, то перенаправляем в index
	if g.user is not None and g.user.is_authenticated:
		return redirect(url_for('index'))
	form = SignUpForm()
	if form.validate_on_submit():
		# если пользователь с таким имейлом или логином уже есть, то сообщаем об этом
		if User.query.filter_by(email=form.email.data).count() != 0:
			flash('This email is already in use.')
			return redirect(url_for('sign_up'))
		if User.query.filter_by(nickname=form.nickname.data).count() != 0:
			flash('This nickname is already in use. Please try another one.')
			return redirect(url_for('sign_up'))
		# регистрируем пользователя и перенаправляем в index
		user = User(nickname=form.nickname.data, email=form.email.data, password=form.password.data)
		db.session.add(user)
		db.session.commit()
		flash('Thank you for signing up!')
		return redirect(url_for('index'))
	return render_template("sign_up.html", form=form)
