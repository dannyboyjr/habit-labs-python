import {  useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { addPaymentInfo, getCardDetails } from '../../store/stripe'
import { useDispatch, useSelector } from "react-redux";
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
  const { closeModal } = useModal();
  const user = useSelector((state) => state.session.user);


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const fetchUpdatedCardDetails = async () => {
    setIsLoaded(false);
    await dispatch(getCardDetails())
    setIsLoaded(true)
  };

  const validateInput = () => {
  const newErrors = [];

  if (!firstName.trim()) {
    newErrors.push("First name is required.");
  }
  if (!lastName.trim()) {
    newErrors.push("Last name is required.");
  }

  setErrors(newErrors);
  return newErrors.length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) {
    return;
  }
    
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
      closeModal()
        
  };

  return (
    <div class="enter-card-modal">
{errors.map((error, idx) => (
      <div key={idx} className="error-message">
        {error}
      </div>
    ))}
    {error && <div className="error-message">{error}</div>}
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
      {success && <div className="success-message">Card saved successfully</div>}
    </form>
    </div>
)
  }


export default EnterCardInfoModal;