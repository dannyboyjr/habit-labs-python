import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { addPaymentInfo, getCardDetails, deleteCardDetails } from '../../store/stripe'
import { useDispatch, useSelector } from "react-redux";
import dotenv from 'dotenv';

import './ProfileCreditCard.css'

dotenv.config();

const SaveCardForm = () => {

  const apiUrl = process.env.REACT_APP_BASE_URL;

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch()
  let user = useSelector((state) => state.session.user);
  let reduxCardInfo = useSelector((state) => state.stripe.card_details)
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
 

  const fetchUpdatedCardDetails = async () => {
    setIsLoaded(false);
    await dispatch(getCardDetails())
    setIsLoaded(true)
  };

  const handleDeleteCard = async (e) => {
    e.preventDefault();
    await dispatch(deleteCardDetails());
    setIsLoaded(false); // set isLoaded to false while fetching updated card details
    await fetchUpdatedCardDetails(); // wait for the updated card details to be fetched
    setIsLoaded(true); // set isLoaded to true after fetching updated card details
  };

  useEffect(() => {
    setIsLoaded(user.has_payment_info);
  }, [user.has_payment_info]);

  useEffect(()=>{
    dispatch(getCardDetails()).then(() => setIsLoaded(true));
  },[dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setProcessing(true);

    const { data } = await axios.post(`${apiUrl}/api/stripe/create-setup-intent`, 
    {
      firstName,
      lastName,
      email: user.email
    }
  );
    const cardElement = elements.getElement(CardElement);

    const { error } = await stripe.confirmCardSetup(data.clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return
    } else {
      setError(null);
      setProcessing(false);
    }
      const input = data.clientSecret;
      const output = input.split("_secret_")[0];
      dispatch(addPaymentInfo(output)).then(()=>fetchUpdatedCardDetails().then(()=> setIsLoaded(true)))
      
        
  };

  return (
    <div className="card-form-container">
      {user.has_payment_info && reduxCardInfo ? (
        <div className="card-details">
          <p>Card Details</p>
          <p>Last 4 digits: {reduxCardInfo.last4}</p>
          <p>Expiration: {reduxCardInfo.exp_month}/{reduxCardInfo.exp_year}</p>
          <button className="delete-card-btn" onClick={handleDeleteCard}>Delete Card</button>
        </div>
      ) : (
        <form className="card-form" onSubmit={handleSubmit}>
          <div className='first-last-name-stripe-form'>
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
          </div>
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

