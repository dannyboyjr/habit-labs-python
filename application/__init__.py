import os
from flask import Flask, render_template, request, session, redirect, jsonify, abort
from flask_login import login_required, current_user
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.habit_routes import habit_routes
from .api.todo_routes import todo_routes
from .api.journal_routes import journal_routes
from .api.incomplete_log_routes import incomplete_log_routes
from .api.checkin_routes import check_in_routes
from .api.stripe import stripe_routes
from .seeds import seed_commands
from .config import Config
import stripe


application = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

# Setup login manager
login = LoginManager(application)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
application.cli.add_command(seed_commands)

application.config.from_object(Config)
application.register_blueprint(user_routes, url_prefix='/api/users')
application.register_blueprint(auth_routes, url_prefix='/api/auth')
application.register_blueprint(habit_routes, url_prefix='/api/habits')
application.register_blueprint(todo_routes, url_prefix='/api/todos')
application.register_blueprint(journal_routes, url_prefix='/api/journals')
application.register_blueprint(incomplete_log_routes, url_prefix='/api/incomplete_logs')
application.register_blueprint(check_in_routes, url_prefix='/api/check_in')
application.register_blueprint(stripe_routes, url_prefix='/api/stripe')
db.init_app(application)
Migrate(application, db)

# Application Security
CORS(application)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@application.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@application.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@application.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    application.view_functions[rule.endpoint].__doc__ ]
                    for rule in application.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return application.send_from_directory('public', 'favicon.ico')
    return application.send_static_file('index.html')


@application.errorhandler(404)
def not_found(e):
    return application.send_static_file('index.html')


if __name__ == '__main__':
    application.run()
