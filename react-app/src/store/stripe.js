import { getUser } from "./session";
const SAVE_STRIPE_DETAILS = "stripe/loadStripe";
const LOAD_STRIPE_DETAILS = 'stripe/loadDetails'
// const CREATE_STRIPE_INTENT = 'stripe/createStripeIntent'
const DELETE_CARD = 'stripe/deleteCard'

const saveDetails = (body) => ({
    type: SAVE_STRIPE_DETAILS,
    body
});
const loadStripeDetails = (cardDetails) => ({
    type: LOAD_STRIPE_DETAILS,
    cardDetails
});

const deleteCard = (body) => ({
    type: DELETE_CARD,
    body
})

export const addPaymentInfo = (paymentIntentId) => async (dispatch, getState) => {
    const response = await fetch(`/api/stripe/save-stripe-details/${paymentIntentId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(saveDetails(data));

        const currentUserId = getState().session.user.id; // Get the current user ID from the session state
        dispatch(getUser(currentUserId)); // Fetch the updated user data and update the session state

        return data;
    } 
}

export const getCardDetails = () => async (dispatch) => {
    const response = await fetch(`/api/stripe/get_payment_details`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadStripeDetails(data));
        return data;
    } 
}


export const deleteCardDetails = () => async (dispatch) => {
    const response = await fetch(`/api/stripe/delete_payment_method`, {
        method: "DELETE",
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteCard(data));
        return data;
    }
};



const initialState = {};

const StripeReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type) {
        case LOAD_STRIPE_DETAILS:
            newState = action.cardDetails;
            return newState;
        case DELETE_CARD:
            newState = {}
            return newState
        default:
            return state;
        }
}

export default StripeReducer;