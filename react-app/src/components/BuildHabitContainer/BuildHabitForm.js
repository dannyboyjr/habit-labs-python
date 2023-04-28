import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {createAHabit} from '../../store/habit'
import './BuildHabitForm.css'

const BuildHabitForm = () => { 

    //set form date 66 days out
    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 66);
        return date.toISOString().split("T")[0];
      }
      const getTodaysDate = () => {
        const date = new Date();
        const timezoneOffsetInMilliseconds = date.getTimezoneOffset() * 60 * 1000;
        const userTimezoneDate = new Date(date.getTime() - timezoneOffsetInMilliseconds);
        return userTimezoneDate.toISOString().split("T")[0];
      };
      

      // formats date for submition
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        //padStart makes it so that there is a leading 0 if only "4" is entered, for example so 2023-4-1 -> 2023-04-01.
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

  const dispatch = useDispatch()
  const user = useSelector(state => state.session.user)
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("")
  const [amount, setAmount] = useState(null)
  const [cadence, setCadence] = useState(1)
  const [endDate, setEndDate] = useState(getDefaultDate())
  const [sickoMode, setSickoMode] = useState(JSON.parse(false))

  const newHabit = {
    name: name,
    amount: amount,
    cadence: cadence,
    end_date: endDate,
    is_build: true,
    sicko_mode: sickoMode
}

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.name || !newHabit.amount || !newHabit.cadence || !newHabit.end_date) {
        setErrorMessage("all inputs are required");
      }
      else if(!user.has_payment_info) {
        alert("You need to enter payment info!")
      } else {
   
    dispatch(createAHabit(newHabit)).then(()=>{
            setName("");
            setAmount("");
            setCadence(1);
            setEndDate(getDefaultDate());
            setSickoMode(false);
            setShowDropdown(false);

        })
    }
  };

  // Makes it so that the form collapses if you click outside of the form
  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDropdown(false);
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
console.log(today)
  return (
    <form className="new-habit-form" ref={formRef} onSubmit={handleSubmit}>
      {/* name */}
     
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

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
              name="end_date"
              value={endDate}
              min={today}
              onChange={(e) => setEndDate(formatDate(e.target.value))}
            />
             <label>End Date</label>
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


          <button className="submit-button"type="submit">
            Create
          </button>
        </div>
        
      )}
      
    </form>
  );
};

export default BuildHabitForm;
