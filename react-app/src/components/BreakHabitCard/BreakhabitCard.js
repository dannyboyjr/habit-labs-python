import "./BreakHabitCard.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux"
import { deleteHabitById } from '../../store/habit';
import OpenModalButton from '../OpenModalButton/index'
import EditBuildhabitModal from "../EditBuildHabitModal/EditBuildHabitModal";
import CreateJournalModal from '../CreateJournalModal/CreateJournalModal'
import IncompleteIcon from '../../assets/IncompleteIcon.png'
import './BreakHabitCard.css'

const BreakHabitCard = ({ habit }) => {

  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
 
  

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
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
         <div className="button-box" id="break-btn">
              <OpenModalButton
                      buttonText={IncompleteIcon}
                      isImage={true}
                      className="break-habit-image"
                      modalComponent={<CreateJournalModal habit={habit} />}
                    />  
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
        </div>

      </div>
    )}
  </div>
);
};
export default BreakHabitCard;
