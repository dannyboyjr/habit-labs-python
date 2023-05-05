import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {createATodo} from '../../store/todo'
import OpenModal from '../OpenModal'
import EnterCardInfoModal from '../EnterCardInfoModal/EnterCardInfoModal'
import './TodoForm.css'

//!put into env - also found on /pages/profile.js / BreakhabitForm / Buildhabitform
const stripePromise = loadStripe('pk_test_51MRsbnKjQQj6FDkFdswvvgQHKPd9FikpeTwVIxeGyvDuLFqvcmqRvNq7f3SxBO04DqIvd3PrEcKePAa4Yb6PWzfK004l1twuBq');

const TodoForm = () => {

    //auto sets defualt date to end today at midnight
    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate());
        return date.toISOString().split("T")[0];
      }

      const getTodaysDate = () => {
        const date = new Date();
        const timezoneOffsetInMilliseconds = date.getTimezoneOffset() * 60 * 1000;
        const userTimezoneDate = new Date(date.getTime() - timezoneOffsetInMilliseconds);
        return userTimezoneDate.toISOString().split("T")[0];
      };
      

  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const [showDropdown, setShowDropdown] = useState(false);
  const [enterPaymentDetails, setEnterPaymentDetails] = useState(false)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(null)
  const [lateFee, setLateFee] = useState(10)
  const [dueDate, setDueDate] = useState(getDefaultDate())
  const [sickoMode, setSickoMode] = useState(JSON.parse(false))
  const [errorMessage, setErrorMessage] = useState("");


  const newTodo = {
    name: name,
    amount: amount,
    late_fee: lateFee,
    due_date: dueDate,
    sicko_mode: sickoMode
}
 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.name || !newTodo.amount || !newTodo.late_fee || !newTodo.due_date) {
        setErrorMessage("all inputs are required");
      }
      else if(!user.has_payment_info) {
        setEnterPaymentDetails(true)
      } else {
    dispatch(createATodo(newTodo)).then(()=>{
        setName("");
        setAmount('');
        setLateFee(10);
        setDueDate(getDefaultDate());
        setSickoMode(false);
        setShowDropdown(false)
        })
    }
  };

  // Makes it so that the form collapses if you click outside of the form
  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDropdown(false);
        setEnterPaymentDetails(false);
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

  const today = getTodaysDate()

  return (
    <div>
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
   
    <form className="new-habit-form" ref={formRef} onSubmit={handleSubmit}>
      {/* name */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <div className="name-and-amount-form">
      <div className="name-input">
        <input
              type="text"
              value={name}
              placeholder="Add New Todo"
              onChange={(e) => setName(e.target.value)}
              onClick={toggleDropdown}
              required
            />
      </div>

      {/* amount */}
      <div className="amount-input">
            <input
              type="number"
              value={amount}
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
              onClick={toggleDropdown}
              required
            />
      </div>

      </div>

      {showDropdown && (
        <div className="dropdown-form-items">
          <div className="form-element form-date-picker">
         
         <input
           type="date"
           name="due_date"
           value={dueDate}
           min={today}
           onChange={(e) => setDueDate(e.target.value)}
         />
          <label>Due Date</label>
       </div>

       <div className="lateFee-input">
            <input
              type="number"
              value={lateFee}
              placeholder="Late Fee"
              onChange={(e) => setLateFee(e.target.value)}
              onClick={toggleDropdown}
              required
            />
            <label>daily late fee</label>
      </div>
       
      <div className="form-element sicko-mode-form">
          <div className="checkbox-apple">
            <input
              id="check-apple"
              type="checkbox"
              value={sickoMode}
              onChange={(e) => setSickoMode(e.target.checked)}
            />
            <label for="check-apple"></label>
            </div>
            <label>Sicko Mode</label>
          </div>
          <button className="submit-button-todo" type="submit">Create</button>
        </div>
        
      )}
      
    </form>
    </div>
  );
};

export default TodoForm;
