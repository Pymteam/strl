from flask import render_template, redirect, url_for, g, flash
from flask_login import current_user, login_user, logout_user, login_required
from . import app, lm, db
from .forms import SignUpForm, SignInForm
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


