import './BuildHabitCard.css'
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteHabitById } from '../../store/habit';
import { createACheckin } from '../../store/checkin';
import EditBuildhabitModal from '../EditBuildHabitModal/EditBuildHabitModal';
import OpenModalButton from '../OpenModalButton/index'

const BuildHabitCard = ({ habit }) => {
  const dispatch = useDispatch()
  const checkIns = useSelector(state => state.checkins)
  const checkinArray = Object.values(checkIns)
  const [showDropdown, setShowDropdown] = useState(false);
  const [countdown, setCountdown] = useState('');

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    // Perform deletion logic here
    dispatch(deleteHabitById(habit.id)).then(handleDropdownToggle())
  };

  const handleComplete = () => {

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


  useEffect(() => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDate = new Date();
    const userTime = userDate.toLocaleString('en-US', { timeZone: userTz });
    const userMidnight = new Date(userTime);
    userMidnight.setHours(24, 0, 0, 0);
  
    const countdownInterval = setInterval(() => {
      const timeDiff = userMidnight - new Date();
      const hoursLeft = Math.floor(timeDiff / 1000 / 60 / 60);
      const minutesLeft = Math.floor((timeDiff / 1000 / 60) % 60);
      const secondsLeft = Math.floor((timeDiff / 1000) % 60);
      
      setCountdown(
        `${hoursLeft}:${minutesLeft}:${secondsLeft}`
      );
    }, 1000);
  
    return () => clearInterval(countdownInterval);
  }, []);
  
  

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
          <div className="habit-card-time">{countdown}</div>
        </div>
        {habit.sicko_mode && <p className="habit-card-sicko-mode">Sicko mode</p>}
        {!habit.sicko_mode && 
        <div ref={formRef} className="habit-card-dropdown-container">
          <div
            className="habit-card-dropdown-button"
            onClick={handleDropdownToggle}
          >
            <div className="habit-card-dropdown-icon"></div>
            <div className="habit-card-dropdown-icon"></div>
            <div className="habit-card-dropdown-icon"></div>
          </div>
          {habit.sicko_mode && <p className="">Sicko mode</p>}
          {!habit.sicko_mode && showDropdown && (
            <div className="habit-card-dropdown-menu">
              <div className="habit-card-dropdown-item" >
              <OpenModalButton
              buttonText="Edit"
              // onItemClick={closeMenu}
              modalComponent={<EditBuildhabitModal habit={habit}/>}
            />
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
}
      </div>
    </div>
    }
    </div>
  );
};

export default BuildHabitCard;