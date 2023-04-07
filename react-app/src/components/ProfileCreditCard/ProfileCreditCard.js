import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './ProfileCreditCard.css';

const ProfileCreditCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const cardElementOptions = {
    style: {
      base: {
        color: '#ffffff',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      invalid: {
        color: '#ff4d4d',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
    } else {
      const response = await axios.post('/api/save_payment_method', {
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.success) {
        setMessage('Credit card information saved successfully.');
      } else {
        setMessage('Error saving credit card information.');
      }

      setSaving(false);
    }
  };

  return (
    <div className="credit-card-container cool-bg">
      <h2 className="cool-header">Credit Card Information</h2>
      <form className="stripe-form" onSubmit={handleSubmit}>
        <CardElement options={cardElementOptions} />
        <button className="save-btn" type="submit" disabled={!stripe || saving}>
          Save Card
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProfileCreditCard;
