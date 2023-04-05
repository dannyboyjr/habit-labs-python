import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createAHabit} from '../../store/habit'
import './BreakhabitForm.css'


const BreakHabitForm = () => {
   

  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(1.00)
  const [cadence, setCadence] = useState(1)
  const [sickoMode, setSickoMode] = useState(JSON.parse(false))
  // const [formData, setFormData] = useState({
  //   name: "",
  //   amount: 1.00,
  //   sickoMode: false,
  //   is_build: false
  // });

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
      } else {
    dispatch(createAHabit(newHabit)).then(()=>{
      setName("");
      setAmount(1.00);
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
    <form ref={formRef} onSubmit={handleSubmit} className="break-habit-form">
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* name */}
      <div className="input-container name-input">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onClick={toggleDropdown}
          required
          placeholder="Name"
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

      <div className="button-container">
        <button type="submit">Create</button>
      </div>
    </form>
  );
};

export default BreakHabitForm;
