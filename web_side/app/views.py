from app import app

@app.route('/')
@app.route('/index')
def index():
	return "Hello index"

@app.route('/sign_in')
def sign_in():
	return "Hello sign_in"

@app.route('/sign_up')
def sign_up():
	return "Hello sign_up"