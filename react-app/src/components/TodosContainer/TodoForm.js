import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createATodo} from '../../store/todo'

const TodoForm = () => {

    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate());
        return date.toISOString().split("T")[0];
      }

  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    amount: 1.00,
    late_fee: 1.00,
    due_date: getDefaultDate(),
    sickoMode: false

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parseFloat(value),
    }));
  };

  const handleRadioChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.late_fee || !formData.due_date) {
        setErrorMessage("all inputs are required");
      } else {
    dispatch(createATodo(formData)).then(()=>{
        setFormData({
            name: "",
            amount: 1.00,
            late_fee: 1.00,
            due_date: getDefaultDate(),
            sickoMode: false
          });
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

  //! Ask jake why I can't just put setShowDropdown(true) in the onclick function down below?
  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => true);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* name */}
      <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          autoComplete="off"
        />
      </div>

      {/* amount */}
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={formData.amount}
          onChange={handleAmountChange}
          onClick={toggleDropdown}
        />
      </div>

      {showDropdown && (
        <div>
          <div>
        <label>Daily Late Fee</label>
        <input
          type="number"
          step="0.01"
          name="late_fee"
          value={formData.late_fee}
          onChange={handleAmountChange}
          onClick={toggleDropdown}
        />
      </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <label>Sicko Mode</label>
            <input
              type="checkbox"
              id="sickoMode"
              name="sickoMode"
              checked={formData.sickoMode}
              onChange={handleRadioChange}
            />
          </div>
          <button type="submit">Create</button>
        </div>
        
      )}
      
    </form>
  );
};

export default TodoForm;
