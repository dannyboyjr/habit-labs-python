import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createATodo} from '../../store/todo'

const TodoForm = () => {

    //auto sets defualt date to end today at midnight
    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate());
        return date.toISOString().split("T")[0];
      }

  const dispatch = useDispatch()
  // const userTimeZone = useSelector(state => state.session.user.timezone)
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(1.00)
  const [lateFee, setLateFee] = useState(1.00)
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
      } else {
    dispatch(createATodo(newTodo)).then(()=>{
        setName("");
        setAmount(1.00);
        setLateFee(1.00);
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
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* name */}
      <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <label>
          Name
        <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={toggleDropdown}
              required
            />
            </label>
      </div>

      {/* amount */}
      <div>
      <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onClick={toggleDropdown}
              required
            />
          </label>
      </div>

      {showDropdown && (
        <div>
          <div>
        <label>Daily Late Fee</label>
        <input
          type="number"
          step="0.01"
          name="late_fee"
          value={lateFee}
          onChange={(e) => setLateFee(e.target.value)}
          onClick={toggleDropdown}
        />
      </div>
          <div>
          <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              
            />
          </div>
          <div>
          <label>
            Enable Sicko Mode
            <input
              type="checkbox"
              value={sickoMode}
              onChange={(e) => setSickoMode(e.target.checked)}
            />
          </label>
          </div>
          <button type="submit">Create</button>
        </div>
        
      )}
      
    </form>
  );
};

export default TodoForm;
