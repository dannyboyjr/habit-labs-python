const LOAD_STRIPE = "stripe/loadStripe";
const LOAD_STRIPE_DETAILS = 'stripe/loadDetails'
const DELETE_CARD = 'stripe/deleteCard'

const loadStripe = (body) => ({
    type: LOAD_STRIPE,
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


export const addPaymentInfo = (paymentIntentId) => async (dispatch) => {
    const response = await fetch(`/api/stripe/test-stripe/${paymentIntentId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadStripe(data));
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
// 

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