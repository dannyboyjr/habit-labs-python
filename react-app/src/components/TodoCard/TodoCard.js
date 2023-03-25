// import './TodoCard.css'
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteTodoById } from '../../store/todo';
import { createACheckin } from '../../store/checkin';
import EditTodoModal from '../EditTodoModal/EditTodoModal'
import OpenModalButton from '../OpenModalButton/index'

const TodoCard = ({ todo }) => {
  const dispatch = useDispatch()
  const checkIns = useSelector(state => state.checkins)
  const checkinArray = Object.values(checkIns)
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    dispatch(deleteTodoById(todo.id)).then(handleDropdownToggle())
  };

  const handleComplete = () => {

    // ! dispatch(createACheckin(todo.id))
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


  //! need to work through logic on how to best only pull tasks that are due. not complete
//   const isCompleteFilter = checkinArray.find((item) => {
//     return habit.id == item.habit_id
//   })

  return (
    <div>
    <div className="habit-card">
      <div className="habit-card-content">
        <div onClick={handleComplete} className="habit-card-button"></div>
        <div className="habit-card-details">
          <h3 className="habit-card-title">{todo.name}</h3>
          <p className="habit-card-amount">{todo.amount}</p>
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
              <div className="habit-card-dropdown-item" >
              <OpenModalButton
              buttonText="Edit"
              // onItemClick={closeMenu}
              modalComponent={<EditTodoModal todo={todo}/>}
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
      </div>
    </div>
    
    </div>
  );
};

export default TodoCard;