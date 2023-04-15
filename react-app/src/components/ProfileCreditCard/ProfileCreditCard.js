import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { addPaymentInfo, getCardDetails, deleteCardDetails } from '../../store/stripe'

import {  useDispatch, useSelector } from "react-redux";

const SaveCardForm = () => {
  const [firstName, setFirstName] = useState('Dan');
  const [lastName, setLastName] = useState('Kimball');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  let hasPaymentInfo = useSelector((state) => state.session.user.has_payment_info);
  const reduxCardInfo = useSelector((state) => state.stripe.card_details)
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch()

  const fetchUpdatedCardDetails = () => {
    setIsLoaded(false);
    dispatch(getCardDetails()).then(() => setIsLoaded(true));
  };

  const handleDeleteCard = () => {
    dispatch(deleteCardDetails()).then(() => {
      setIsLoaded(false);
      hasPaymentInfo = false;
      fetchUpdatedCardDetails();
    });
  };

  useEffect(()=>{
    dispatch(getCardDetails()).then(() => setIsLoaded(true));
  },[dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { data } = await axios.post('http://localhost:8000/api/stripe/create-setup-intent', 
    {
      firstName,
      lastName,
    }
  );
    const cardElement = elements.getElement(CardElement);

    const { error } = await stripe.confirmCardSetup(data.clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
    }
      const input = data.clientSecret;
      const output = input.split("_secret_")[0];
      dispatch(addPaymentInfo(output)).then(()=>{
        setIsLoaded(false)
        hasPaymentInfo = true
        dispatch(getCardDetails())}).then(() => setIsLoaded(true));
        fetchUpdatedCardDetails();
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {hasPaymentInfo && reduxCardInfo ? (
        <div>
          <p>card details</p>
          <p>Last 4 digits: {reduxCardInfo.last4}</p>
          <p>Experation: {reduxCardInfo.exp_month}/{reduxCardInfo.exp_year}</p>
          <button onClick={handleDeleteCard}>Delete Card</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <CardElement />
          <button type="submit" disabled={!stripe || processing}>
            Save Card 
          </button>
          {error && <div>{error}</div>}
          {success && <div>Card saved successfully</div>}
        </form>
      )}
    </div>
  );
};

export default SaveCardForm;

