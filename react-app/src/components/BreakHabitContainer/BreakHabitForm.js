import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {createAHabit} from '../../store/habit'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OpenModal from '../OpenModal'
import EnterCardInfoModal from '../EnterCardInfoModal/EnterCardInfoModal'
import './BreakhabitForm.css'

//!put into env - also found on /pages/profile.js / BuildhabitForm / TodoForm
const stripePromise = loadStripe('pk_live_51MRsbnKjQQj6FDkFTahjONsHu4fA6Za4RJW8aWTPkN6NNMfbUmlncRe44o3kz6ekptfAPzntRDn8xCvoclcpI4PP00yuIDKRwn');


const BreakHabitForm = () => {
   

  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enterPaymentDetails, setEnterPaymentDetails] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [cadence, setCadence] = useState(1)
  const [sickoMode, setSickoMode] = useState(JSON.parse(false))

  const newHabit = {
    name: name,
    amount: amount,
    cadence: cadence,
    end_date: null,
    is_build: false,
    sicko_mode: sickoMode
}

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.name || !newHabit.amount) {
        setErrorMessage("all inputs are required");
    }
    else if(!user.has_payment_info) {
          setEnterPaymentDetails(true)
      } else {
    dispatch(createAHabit(newHabit)).then(()=>{
      setName("");
      setAmount(null);
      setCadence(1);
      setSickoMode(false);
      setShowDropdown(false);
        })
    }
  };

  // Makes it so that the form collapses if you click outside of the form
  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setShowDropdown(false);
        setEnterPaymentDetails(false)
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formRef]);

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => true);
  };

  return (
    <dv>
       {enterPaymentDetails && (
        
        <OpenModal
        autoOpen={true}
        modalComponent={
          <Elements stripe={stripePromise}>
        <EnterCardInfoModal />
        </Elements>
        }
            />  
          
      )}

    <form  className="new-habit-form" ref={formRef} onSubmit={handleSubmit} >
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* name */}
      <div className="name-and-amount-form">
      <div className="name-input">
        <input
              type="text"
              value={name}
              placeholder="Add New Habit"
              onChange={(e) => setName(e.target.value)}
              onClick={toggleDropdown}
              required
            />
      </div>

      {/* amount */}
      <div className="input-container amount-input">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onClick={toggleDropdown}
          required
          placeholder="Amount"
        />
      </div>

      </div>

      {showDropdown && (

      <div className="dropdown-form-items">
        <button className="submit-button" id="break-habit-button-form" type="submit">Create</button>
      </div>
      )}
    </form>
    </dv>
  );
};

export default BreakHabitForm;
