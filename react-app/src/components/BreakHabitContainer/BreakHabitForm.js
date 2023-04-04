import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createAHabit} from '../../store/habit'



const BreakHabitForm = () => {
   

  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    amount: 1.00,
    sickoMode: false,
    is_build: false
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


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
        setErrorMessage("all inputs are required");
      } else {
    //! Delete concole log
    console.log(formData)
    dispatch(createAHabit(formData)).then(()=>{
        setFormData({
            name: "",
            amount: 1.00,
            sickoMode: false,
            is_build: false
          });
          setShowDropdown(false)
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
          {/* <div>
            <label>Sicko Mode</label>
            <input
              type="checkbox"
              id="sickoMode"
              name="sickoMode"
              checked={formData.sickoMode}
              onChange={handleRadioChange}
            />
          </div> */}
          <button type="submit">Create</button>
        </div>
        
      )}
      
    </form>
  );
};

export default BreakHabitForm;
