import './BuildHabitCard.css'
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteHabitById } from '../../store/habit';
import { createACheckin } from '../../store/checkin';

const BuildHabitCard = ({ habit }) => {
  const dispatch = useDispatch()
  const checkIns = useSelector(state => state.checkins)
  const checkinArray = Object.values(checkIns)
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    // Perform edit logic here
  };

  const handleDelete = () => {
    // Perform deletion logic here
    dispatch(deleteHabitById(habit.id)).then(handleDropdownToggle())
  };

  const handleComplete = () => {
    console.log(habit.id)
    dispatch(createACheckin(habit.id))
  }

  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {

      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDropdown(false);
      }};

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formRef]);


  const isCompleteFilter = checkinArray.find((item) => {
    return habit.id == item.habit_id
  })

  return (
    <div>
      { !isCompleteFilter && habit.is_build &&
    <div className="habit-card">
      <div className="habit-card-content">
        <div onClick={handleComplete} className="habit-card-button"></div>
        <div className="habit-card-details">
          <h3 className="habit-card-title">{habit.name}</h3>
          <p className="habit-card-amount">{habit.amount}</p>
          <p className="habit-card-line">On the line</p>
          <div className="habit-card-time">time placeholder</div>
        </div>
        <div ref={formRef} className="habit-card-dropdown-container">
          <div
            className="habit-card-dropdown-button"
            onClick={handleDropdownToggle}
          >
            <div className="habit-card-dropdown-icon"></div>
            <div className="habit-card-dropdown-icon"></div>
            <div className="habit-card-dropdown-icon"></div>
          </div>
          {showDropdown && (
            <div className="habit-card-dropdown-menu">
              <div className="habit-card-dropdown-item" onClick={handleEdit}>
                Edit
              </div>
              <div
                className="habit-card-dropdown-item danger"
                onClick={handleDelete}
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    }
    </div>
  );
};

export default BuildHabitCard;