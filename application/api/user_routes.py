from flask import Blueprint, jsonify, request
from flask_login import login_required,current_user
from application.models import User, db
import re
import stripe


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()



# Email validation regex pattern
EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")

@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):
    """
    EDIT: user details
    """
    if current_user.id != id:
        return jsonify({"Error": "Can only edit your own profile"}), 403

    user = User.query.get(id)

    if not user:
        return jsonify({"Error": "User not found"}), 404

    data = request.get_json()

    new_username = data.get('username', user.username)
    new_email = data.get('email', user.email)
    new_first_name = data.get('first_name', user.first_name)
    new_last_name = data.get('last_name', user.last_name)
    new_timezone = data.get('timezone', user.timezone)

    missing_fields = []

    if not new_first_name:
        missing_fields.append("First Name")
    if not new_last_name:
        missing_fields.append("Last Name")
    if not new_email:
        missing_fields.append("Email")
    if not new_username:
        missing_fields.append("Username")
    if not new_timezone:
        missing_fields.append("Timezone")

    if missing_fields:
        return jsonify({"Error": f"Values for {', '.join(missing_fields)} cannot be empty or None"}), 400


    if not EMAIL_REGEX.match(new_email):
        return jsonify({"Error": "Invalid email format"}), 400

    existing_username = User.query.filter(User.username == new_username, User.id != id).first()
    existing_email = User.query.filter(User.email == new_email, User.id != id).first()

    if existing_username:
        return jsonify({"Error": "Username already exists"}), 400

    if existing_email:
        return jsonify({"Error": "Email already exists"}), 400

    user.first_name = new_first_name
    user.last_name = new_last_name
    user.username = new_username
    user.email = new_email
    user.timezone = new_timezone

    db.session.commit()

    return jsonify(user.to_dict()), 200



@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    """
    Delete a user by id and returns a success message
    """
    if current_user.id != id:
        return jsonify({"Error": "Can only delete your own profile"}), 403

    user = User.query.get(id)

    if not user:
       return jsonify({"Error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return {'message': f'User {id} successfully deleted'}




# @user_routes.route('/test-stripe', methods=["GET"])
# @login_required
# def get_setup_intent_stuff(payment_intent_id):
        
#         retrieved = stripe.SetupIntent.retrieve(
#         ,
# )   
#         current_user.stripe_payment_id = retrieved['payment_method']
#         current_user.has_payment_info = True
#         db.session.commit()

