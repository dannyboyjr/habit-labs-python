// import './TodoCard.css'
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteTodoById } from '../../store/todo';
import { createACheckin } from '../../store/checkin';
import { completeATodo } from "../../store/todo";
import EditTodoModal from '../EditTodoModal/EditTodoModal'
import OpenModalButton from '../OpenModalButton/index'

const TodoCard = ({ todo }) => {
  const dispatch = useDispatch()
  const userTimezone = useSelector(state => state.session.user.timezone)
  const checkIns = useSelector(state => state.checkins)
  const checkinArray = Object.values(checkIns)
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    dispatch(deleteTodoById(todo.id)).then(handleDropdownToggle())
  };

  const handleComplete = () => {

    dispatch(completeATodo(todo.id))
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

  const calculateTimeRemaining = () => {
    const dueDate = new Date(todo.due_date);
    const dueDateInUserTimezone = new Date(dueDate.toLocaleString('en-US', { timeZone: userTimezone }));
    dueDateInUserTimezone.setDate(dueDateInUserTimezone.getDate());
    dueDateInUserTimezone.setHours(23, 59, 59, 0);

  const now = new Date();
  

  const nowInUserTimezone = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));

  const difference = dueDateInUserTimezone - nowInUserTimezone;

  // if (difference < 0) {
  //   setTimeRemaining('time has expired! hurry, your late fee is due tonight!');
  //   return;
  // }

    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
      setTimeRemaining(`${days}${days === 1 ? ' day' : ' days'}`);
    } else {
      setTimeRemaining(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
    }
  };
  useEffect(() => {
    calculateTimeRemaining();
    
    const timerId = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(timerId);
  }, []);


  return (
    <div>
        <div className="habit-card">
  
          <div className="button-box">
            <div onClick={handleComplete} className="habit-card-button-square"></div>
          </div>
  
          <div className="habit-card-content">
  
            <div className="habit-card-details">
              <h3 className="habit-card-title">{todo.name}</h3>
            </div>
  
          {/* Dropdown */}
            <div>
              {todo.sicko_mode && (<p className="habit-card-sicko-mode">Sicko mode</p>)}
              {!todo.sicko_mode && (
                <div ref={formRef} className="habit-card-dropdown-container">
                  <div className="habit-card-dropdown-button" onClick={handleDropdownToggle}>
                    <div className="habit-card-dropdown-icon"></div>
                    <div className="habit-card-dropdown-icon"></div>
                    <div className="habit-card-dropdown-icon"></div>
                  </div>
                  {!todo.sicko_mode && showDropdown && (
                    <div className="habit-card-dropdown-menu">
                      <div className="habit-card-dropdown-item">
                        <OpenModalButton
                          buttonText="Edit"
                          modalComponent={<EditTodoModal todo={todo} />}
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
                <div className="habit-card-amount">${todo.amount}</div>
                <p className="habit-card-line">On the line</p>
              </div>
              <div>
               <div className="habit-card-days-complete" > {todo.late_fee} </div>
               <p className="habit-card-line">daily late fee</p>
              </div>
              <div>
                <div className="habit-card-time">{timeRemaining}</div>
                <p className="habit-card-line">Due In</p>
              </div>
              
          </div>
  
        </div>
    </div>
  );
  };

  

export default TodoCard;