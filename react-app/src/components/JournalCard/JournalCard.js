import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserHabits } from '../../store/habit';
import { editJournalById, deleteJournalById } from '../../store/journal';
import './JournalCard.css'
const JournalCard = ({ journal }) => {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habits);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedWhyMissed, setEditedWhyMissed] = useState(journal.why_missed);
  const [editedFutureAction, setEditedFutureAction] = useState(journal.future_action);

  useEffect(() => {
    dispatch(getAllUserHabits());
  }, [dispatch]);

  const habit = habits[journal.habit_id];

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const onEdit = () => {
    setEditing(true);
  };

  const onDelete = (e) =>{
    e.preventDefault()
    dispatch(deleteJournalById(journal.id))
  }
  //created date formating
  const createdDate = new Date(journal?.created_at);
const formattedDate = createdDate.toLocaleDateString();

  const onSave = () => {
    const editedJournal = {
        why_missed:editedWhyMissed,
        future_action: editedFutureAction,
        habit_id: journal.habit_id,
        todo_id: journal.todo_id,
        id: journal.id

    }
    dispatch(editJournalById(journal.id, editedJournal));
    setEditing(false);
  };

  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [formRef]);

  return (
    <div className="journal-card">

      <div className='journal-header'>

      <div className='journal-name-and-date'>
      <h2>{habit?.name}</h2>
      <p className="date-stamp">{formattedDate}</p>
      </div>

      <div ref={formRef} className="journal-card-dropdown-container">
        <div className="journal-card-dropdown-button" onClick={handleDropdownToggle}>
          <div className="journal-card-dropdown-icon"></div>
          <div className="journal-card-dropdown-icon"></div>
          <div className="journal-card-dropdown-icon"></div>
        </div>

        {showDropdown && (
          <div className="journal-card-dropdown-menu">
            <div className="journal-card-dropdown-item" onClick={onEdit}>
              Edit
            </div>
            <div className="journal-card-dropdown-item danger"onClick={onDelete}>Delete</div>
          </div>
        )}
      </div>
      </div>
      
      {editing ? (
        <>
        <div className='journal-stack'>
          <label className='journal-header'>
            Why missed:
            </label>
            <textarea
            className='journal-input'
            id="edit-journal-input"
              type="text"
              value={editedWhyMissed}
              onChange={(e) => setEditedWhyMissed(e.target.value)}
            />
         
          </div>


          <div className='journal-stack'>
          <label className='journal-header'>
            Future action:
            </label>
            <textarea
              className='journal-input'
              id="edit-journal-input"
              type="text"
              value={editedFutureAction}
              onChange={(e) => setEditedFutureAction(e.target.value)}
            />
          
          </div>
          <div className="modal-journal-buttons">
          <button id="save-journal-btn" onClick={onSave}>Save</button>
          </div>
        </>
      ) : (
        <>
          <div className='journal-stack'>
          <h3>Why missed: </h3>
          <span> {journal.why_missed}</span>
          </div>

          <div className='journal-stack'>
          <h3>Future Action: </h3>
          <span>{journal.future_action}</span>
          </div>
          
        </>
      )}
    </div>
  );
};

export default JournalCard;

