import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {createAHabit} from '../../store/habit'

const BuildHabitForm = () => {

  //! Not being used currently. only daily habits are enabled. once custom habits are enabled this will be relevant
    const cadenceOptions = [
  { value: 1, label: "daily" },
  { value: 8, label: "weekly" },
  { value: 30, label: "monthly" },
    ];


    //set form date 66 days out
    const getDefaultDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 66);
        return date.toISOString().split("T")[0];
      }

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [formData, setFormData] = useState({
  //   name: "",
  //   amount: 1.00,
  //   cadence: 1,
  //   end_date: getDefaultDate(),
  //   sickoMode: false,
  //   is_build: true
  // });

  const [name, setName] = useState("")
  const [amount, setAmount] = useState(1.00)
  const [cadence, setCadence] = useState(1)
  const [endDate, setEndDate] = useState(getDefaultDate())
  const [sickoMode, setSickoMode] = useState(JSON.parse(false))

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // const handleAmountChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: parseFloat(value),
  //   }));
  // };

  // const handleCheckedChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: checked,
  //   }));
  // };

  // const handleDateChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };
  const newhabit = {
    name: name,
    amount: amount,
    cadence: cadence,
    end_date: endDate,
    is_build: true,
    sicko_mode: sickoMode
}

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newhabit.name || !newhabit.amount || !newhabit.cadence || !newhabit.end_date) {
        setErrorMessage("all inputs are required");
      } else {
   
    dispatch(createAHabit(newhabit)).then(()=>{
            setName("");
            setAmount(1.00);
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

  //! Ask jake why I can't just put setShowDropdown(true) in the onclick function down below?
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
              onClick={{toggleDropdown}}
              required
            />
          </label>
      </div>

      {showDropdown && (
        <div>
          {/* <div>
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
          </div> */}
          <div>
          <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(formatDate(e.target.value))}
              
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

export default BuildHabitForm;
