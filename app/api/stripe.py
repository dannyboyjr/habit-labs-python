from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import User, db
import stripe

stripe_routes = Blueprint('stripe', __name__)


stripe.api_key = "sk_test_51MRsbnKjQQj6FDkF9qdqgcNngB174beRP0Zl0Z0CPFTMEe97g9wiDcBHUBUovaPW8U6pvrjTILkiT0lApxbX7TBw004E5Fte1u"

@stripe_routes.route('/create-setup-intent', methods=['POST'])
def create_setup_intent():
    data = request.get_json()
    customer = stripe.Customer.create(
        name=f"{data['firstName']} {data['lastName']}",
        )
    setup_intent = stripe.SetupIntent.create(customer=customer['id'])
    return jsonify({'clientSecret': setup_intent['client_secret']})




@stripe_routes.route('/test-stripe/<string:paymentIntentId>', methods=["GET"])
@login_required
def get_setup_intent_stuff(paymentIntentId):
        retrieved = stripe.SetupIntent.retrieve(
        paymentIntentId,
        )
        current_user.stripe_payment_id = retrieved['payment_method']
        current_user.has_payment_info = True
        db.session.commit()
        
        return retrieved



@stripe_routes.route('/charge_customer', methods=['POST'])
def charge_customer():

    payment_method_id = current_user.stripe_payment_id 

    # Retrieve the PaymentMethod object from Stripe
    try:
        payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
    except stripe.error.InvalidRequestError as e:
        return jsonify({"status": "error", "message": e.user_message})

    # Get the associated customer ID
    customer_id = payment_method.customer

    if not customer_id:
        return jsonify({"status": "error", "message": "Customer not found for this payment method"})

    # Create a new PaymentIntent to charge the customer
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=7979,
            currency="usd",
            customer=customer_id,
            payment_method=payment_method_id,
            off_session=True,
            confirm=True,
        )
        return jsonify({"status": "success", "message": "Charge successful", "payment_intent": payment_intent})
    except stripe.error.CardError as e:
        return jsonify({"status": "error", "message": e.user_message})

@stripe_routes.route('/get_payment_details', methods=['GET'])
def get_payment_details():

    payment_method_id = current_user.stripe_payment_id  # Assuming you have access to the current_user object

    # Retrieve the PaymentMethod object from Stripe
    try:
        payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
    except stripe.error.InvalidRequestError as e:
        return jsonify({"status": "error", "message": e.user_message})

    card_details = payment_method.card

    return jsonify({
        "status": "success",
        "card_details": {
            "brand": card_details.brand,
            "last4": card_details.last4,
            "exp_month": card_details.exp_month,
            "exp_year": card_details.exp_year
        }
    })

@stripe_routes.route('/delete_payment_method', methods=['DELETE'])
@login_required
def delete_payment_method():

    payment_method_id = current_user.stripe_payment_id  # Assuming you have access to the current_user object

    try:
        payment_method = stripe.PaymentMethod.detach(payment_method_id)
        
    except stripe.error.InvalidRequestError as e:
        return jsonify({"status": "error", "message": e.user_message})

    # Update the user's payment method information in your database
    # ...
    current_user.stripe_payment_id = ""
    current_user.has_payment_info = False
    db.session.commit()
    return jsonify({"status": "success", "message": "Payment method deleted"})
