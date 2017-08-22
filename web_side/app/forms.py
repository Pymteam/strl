from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, EqualTo, Email
from wtforms.fields.html5 import EmailField


class SignUpForm(FlaskForm):
	nickname = StringField('nickname', validators=[DataRequired()])
	email = EmailField('email', validators=[DataRequired(), Email()])
	password = PasswordField('New password', validators=[DataRequired(), EqualTo('confirm', message='Password must match')])
	confirm = PasswordField('Repeat Password')


class SignInForm(FlaskForm):
	email = EmailField('email', validators=[DataRequired(), Email()])
	password = PasswordField('password', validators=[DataRequired()])

