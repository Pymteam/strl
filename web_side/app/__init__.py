from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object('config')

# database init
db = SQLAlchemy(app)

lm = LoginManager()
lm.init_app(app)
# если пользователь не авторизован, то перенаправляем на авторизацию:
lm.login_view = 'login'

# storing passwords init
bcrypt = Bcrypt(app)

from . import views, models
