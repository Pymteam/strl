from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, EqualTo, Email
from wtforms.fields.html5 import EmailField


class SignUpForm(FlaskForm):
	nickname = StringField('login', validators=[DataRequired()])
	email = EmailField('email', validators=[DataRequired(), Email()])
	password = PasswordField('New password', [DataRequired(), EqualTo('confirm', message='Password must match')])
	confirm = PasswordField('Repeat Password')
