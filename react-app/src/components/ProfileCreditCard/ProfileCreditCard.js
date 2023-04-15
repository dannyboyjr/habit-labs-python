import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { addPaymentInfo, getCardDetails, deleteCardDetails } from '../../store/stripe'
import {  useDispatch, useSelector } from "react-redux";
import './ProfileCreditCard.css'

const SaveCardForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      setIsLoaded(false)
      dispatch(addPaymentInfo(output)).then(()=>fetchUpdatedCardDetails())
      
        
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-form-container">
      {hasPaymentInfo && reduxCardInfo ? (
        <div className="card-details">
          <p>Card Details</p>
          <p>Last 4 digits: {reduxCardInfo.last4}</p>
          <p>Expiration: {reduxCardInfo.exp_month}/{reduxCardInfo.exp_year}</p>
          <button className="delete-card-btn" onClick={handleDeleteCard}>Delete Card</button>
        </div>
      ) : (
        <form className="card-form" onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className="card-element-container">
            <CardElement className="card-element" />
          </div>
          <button className="save-card-btn" type="submit" disabled={!stripe || processing}>
            Save Card 
          </button>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Card saved successfully</div>}
        </form>
      )}
    </div>
  );
};

export default SaveCardForm;

