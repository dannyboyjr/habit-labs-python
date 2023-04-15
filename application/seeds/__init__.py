from flask.cli import AppGroup
from .users import seed_users, undo_users
from .habits import seed_habits, undo_habits
from .todos import seed_todos, undo_todos
from .journals import seed_journals, undo_journals
from .check_ins import seed_check_ins, undo_check_ins
from .incomplete_logs import seed_incomplete_logs, undo_incomplete_logs
from application.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_habits()
        undo_todos()
        undo_journals()
        undo_check_ins()
        undo_incomplete_logs()
        
    seed_users()
    seed_habits()
    seed_todos()
    seed_journals()
    seed_check_ins()
    seed_incomplete_logs()

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_habits()
    undo_todos()
    undo_journals()
    undo_check_ins()
    undo_incomplete_logs()

    # Add other undo functions here