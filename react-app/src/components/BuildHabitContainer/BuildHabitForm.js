import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createAHabit} from '../../store/habit'

const BuildHabitForm = () => {

    const cadenceOptions = [
  { value: 1, label: "daily" },
  { value: 8, label: "weekly" },
  { value: 30, label: "monthly" },
    ];



    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 66);
        return date.toISOString().split("T")[0];
      }

  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    amount: 1.00,
    cadence: 1,
    end_date: getDefaultDate(),
    sickoMode: false,
    is_build: true
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
    if (!formData.name || !formData.amount || !formData.cadence || !formData.end_date) {
        setErrorMessage("all inputs are required");
      } else {
    //! Delete concole log
    console.log(formData)
    dispatch(createAHabit(formData)).then(()=>{
        setFormData({
            name: "",
            amount: 1.00,
            cadence: 1,
            end_date: getDefaultDate(),
            sickoMode: false,
            is_build: true
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
            <label>Cadence:</label>
            <select
              name="cadence"
              value={formData.cadence}
              onChange={handleAmountChange}
            >
              <option value="">Select cadence</option>
              {cadenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
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

export default BuildHabitForm;
