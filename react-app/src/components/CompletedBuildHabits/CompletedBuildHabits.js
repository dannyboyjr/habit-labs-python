
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteHabitById } from '../../store/habit';
import { deleteCheckinByHabitId } from '../../store/checkin'
import { getSavedStats } from '../../store/incomplete_log';

import EditBuildhabitModal from '../EditBuildHabitModal/EditBuildHabitModal';
import OpenModalButton from '../OpenModalButton/index'
import CheckMark from '../../assets/check.png'
import './CompletedBuildHabits.css'

const CompletedBuildHabits = ({ habit }) => {
  const dispatch = useDispatch()
  const checkIns = useSelector(state => state.checkins)
  const checkinArray = Object.values(checkIns)
  const [showDropdown, setShowDropdown] = useState(false);
  const [countdown, setCountdown] = useState('');

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    dispatch(deleteHabitById(habit.id)).then(handleDropdownToggle())
  };

  const markIncomplete = () => {
    dispatch(deleteCheckinByHabitId(habit.id)).then(()=>  dispatch(getSavedStats()));
  }

  //use to calculate days remaining
  const calculateDays = (habit) => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    const currentDate = new Date().toLocaleString('en-US', { timeZone: userTz });
    const currentDateObj = new Date(currentDate);
  
    const createdDate = new Date(habit.created_at).toLocaleString('en-US', { timeZone: userTz });
    const createdDateObj = new Date(createdDate);
  
    const endDate = new Date(habit.end_date).toLocaleString('en-US', { timeZone: userTz });
    const endDateObj = new Date(endDate);
  
    const daysComplete = Math.max(1, Math.floor((currentDateObj - createdDateObj) / (1000 * 60 * 60 * 24)) + 1);
    const totalDays = Math.floor((endDateObj - createdDateObj) / (1000 * 60 * 60 * 24)) + 1;
  
    return {
      daysComplete: Math.min(daysComplete, totalDays),
      totalDays,
    };
  };
  const { daysComplete, totalDays } = calculateDays(habit);


  
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

//counts down time left today
  useEffect(() => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userDate = new Date();
    const userTime = userDate.toLocaleString('en-US', { timeZone: userTz });
    const userMidnight = new Date(userTime);
    userMidnight.setHours(24, 0, 0, 0);
  
    const countdownInterval = setInterval(() => {
      const timeDiff = userMidnight - new Date();
      if (timeDiff <= 0) { // countdown reached zero or went negative
        setCountdown('24:00:00'); // reset to 24 hours
      } else {
        const hoursLeft = Math.floor(timeDiff / 1000 / 60 / 60);
        const minutesLeft = Math.floor((timeDiff / 1000 / 60) % 60);
        const secondsLeft = Math.floor((timeDiff / 1000) % 60);
        setCountdown(
          `${hoursLeft}:${minutesLeft}:${secondsLeft}`
        );
      }
    }, 1000);
  
    return () => clearInterval(countdownInterval);
  }, []);
  
  

  const isCompleteFilter = checkinArray.find((item) => {
    return habit.id === item.habit_id
  })

return (
  <div>
    {isCompleteFilter && habit.is_build && (
      <div className="habit-card" id="is-complete-habit">

        <div className="button-box" id="build-btn">
          <div onClick={markIncomplete} className="habit-card-button-square">
          <img className="checkmark" src={CheckMark} alt="-"/>
          </div>
        </div>

        <div className="habit-card-content">

          <div className="habit-card-details">
            <h3 className="habit-card-title">{habit.name}</h3>
          </div>

        {/* Dropdown */}
          <div>
            {habit.sicko_mode && (<p className="habit-card-sicko-mode">Sicko mode</p>)}
            {!habit.sicko_mode && (
              <div ref={formRef} className="habit-card-dropdown-container">
                <div className="habit-card-dropdown-button" onClick={handleDropdownToggle}>
                  <div className="habit-card-dropdown-icon"></div>
                  <div className="habit-card-dropdown-icon"></div>
                  <div className="habit-card-dropdown-icon"></div>
                </div>
                {!habit.sicko_mode && showDropdown && (
                  <div className="habit-card-dropdown-menu">
                    <div className="habit-card-dropdown-item">
                      <OpenModalButton
                        buttonText="Edit"
                        modalComponent={<EditBuildhabitModal habit={habit} />}
                      />
                    </div>

                    <div className="habit-card-dropdown-item danger" onClick={handleDelete}>
                      Delete
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
          {/* Dropdown */}
        </div> {/*habit-card-content end */}

        <div className="card-bottom-row-status">
            <div>
              <div className="habit-card-amount">${habit.amount}</div>
              <p className="habit-card-line">On the line</p>
            </div>
            <div>
             <div className="habit-card-days-complete" > {daysComplete}/{totalDays} </div>
             <p className="habit-card-line">days remaining</p>
            </div>
            <div>
              <div className="habit-card-time">{countdown}</div>
              <p className="habit-card-line">restarts In</p>
            </div>
            
        </div>

      </div>
    )}
  </div>
);
};


export default CompletedBuildHabits;
