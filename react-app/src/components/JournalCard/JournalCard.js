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
      <h3>{habit?.name}</h3>
      {editing ? (
        <>
          <label>
            Why missed:
            <input
              type="text"
              value={editedWhyMissed}
              onChange={(e) => setEditedWhyMissed(e.target.value)}
            />
          </label>
          <label>
            Future action:
            <input
              type="text"
              value={editedFutureAction}
              onChange={(e) => setEditedFutureAction(e.target.value)}
            />
          </label>
          <button onClick={onSave}>Save</button>
        </>
      ) : (
        <>
          <p>Why missed: {journal.why_missed}</p>
          <p>Future action: {journal.future_action}</p>
        </>
      )}

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
  );
};

export default JournalCard;

