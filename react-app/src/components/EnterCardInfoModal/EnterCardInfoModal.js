import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { addPaymentInfo, getCardDetails, deleteCardDetails } from '../../store/stripe'
import {  useDispatch, useSelector } from "react-redux";
import dotenv from 'dotenv';
import { useModal } from "../../context/Modal";
import holdupthere from '../../assets/holdupthere.jpg'
import "./EnterCardInfoModal.css";
dotenv.config();

const EnterCardInfoModal = () => {

  const apiUrl = process.env.REACT_APP_BASE_URL;
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  const hasPaymentInfo = useSelector((state) => state.session.user.has_payment_info);
  let reduxCardInfo = useSelector((state) => state.stripe.card_details)

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const fetchUpdatedCardDetails = async () => {
    setIsLoaded(false);
    await dispatch(getCardDetails())
    setIsLoaded(true)
  };

  const handleDeleteCard = () => {
    dispatch(deleteCardDetails())
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setProcessing(true);

    const { data } = await axios.post(`${apiUrl}/api/stripe/create-setup-intent`, 
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
      dispatch(addPaymentInfo(output)).then(()=>fetchUpdatedCardDetails().then(()=> setIsLoaded(true)))
      closeModal()
        
  };

  return (
    <div class="enter-card-modal">

      <div className="holdupthere">
        <img src={holdupthere} />
        <div>
        <h2>Slow down there champ!</h2>
        <p>In order to put your money where your mouth is, we're going to need a payment method! Don't worry, this is just to save payment details.</p>
        </div>
      </div>
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
      <button className="cancel-btn" onClick={closeModal}>Cancel</button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Card saved successfully</div>}
    </form>
    </div>
)
  }


export default EnterCardInfoModal;