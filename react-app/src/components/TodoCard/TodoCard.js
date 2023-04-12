// import './TodoCard.css'
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux"
import { deleteTodoById } from '../../store/todo';
import { getSavedStats } from '../../store/incomplete_log';
import { completeATodo } from "../../store/todo";
import EditTodoModal from '../EditTodoModal/EditTodoModal'
import OpenModalButton from '../OpenModalButton/index'
import './ToDoCard.css'


const TodoCard = ({ todo }) => {
  const dispatch = useDispatch()
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');


  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = async () => {
    await dispatch(deleteTodoById(todo.id)).then(handleDropdownToggle())
  };

  const handleComplete = async () => {
    await dispatch(completeATodo(todo.id)).then(()=> dispatch(getSavedStats()))
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

  const date = new Date(todo.due_date)
  const dateString = date.toISOString().substring(0, 10);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(`${dateString}T23:59:59`)
      const targetTime = new Date(targetDate).getTime();
      const nowTime = new Date().getTime();
      const remainingTime = targetTime - nowTime;
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  

      if (remainingTime <= 0) {
        setTimeRemaining("Past Due");
      } else if (days > 0) {
        setTimeRemaining(`${days}d${days > 1 ? "s" : ""} ${hours}h${hours > 1 ? "s" : ""}`);
      } else {
        setTimeRemaining(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      }
    };

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);

  }, [dateString ]);

  return (
    <div>
        <div className="habit-card">
  
          <div className="button-box todo-btn">
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