import "./BreakHabitCard.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteHabitById } from '../../store/habit';
import OpenModalButton from '../OpenModalButton/index'
import EditBuildhabitModal from "../EditBuildHabitModal/EditBuildHabitModal";
import IncompleteIcon from '../../assets/IncompleteIcon.png'
const BreakHabitCard = ({ habit }) => {
  // if (habit.is_build) {
  //     return null;
  //   }
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch()

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    // Perform deletion logic here
    dispatch(deleteHabitById(habit.id)).then(handleDropdownToggle())
  };


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
  return (
    <div>
      {!habit.is_build && (
        <div className="habit-card">
          <div className="habit-card-content">
            <img className="incompleteImg" src={IncompleteIcon} />
            <div className="habit-card-details">
              <h3 className="habit-card-title">{habit.name}</h3>
              <p className="habit-card-amount">{habit.amount}</p>
              <p className="habit-card-line">On the line</p>
              <div className="habit-card-time">time placeholder</div>
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
              
              {showDropdown && (
                <div className="habit-card-dropdown-menu">
                  <div
                    className="habit-card-dropdown-item">
                    <OpenModalButton
                      buttonText="Edit"
                      // onItemClick={closeMenu}
                      modalComponent={<EditBuildhabitModal habit={habit} />}
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
      )}
    </div>
  );
};

export default BreakHabitCard;
