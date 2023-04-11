import { useState } from "react";
import {createNewJournal} from '../../store/journal'
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'
import { createIncompleteLog } from "../../store/incomplete_log";
import './CreateJournalModal.css'

function CreateJournalModal({habit}) {
    const dispatch = useDispatch();

    const [whyMissed, setWhyMissed] = useState("")
    const [futureAction, setFutureAction] = useState("")
    const [habitId, setHabitId] = useState(null)
    const [todoId, setTodoId] = useState(null)
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    // if(task.is_complete !== undefined){
    //     setTodoId(task.id)
    // }else{
    //     setHabitId(task.id)
    // }
    const onBreakSubmit = (e) => {
        e.preventDefault()
        
        // I need to add CreateJournalModal here. 
        dispatch(createIncompleteLog(slipUp))
    
      }
    
    const newJournalEntry = {
        why_missed: whyMissed,
        future_action: futureAction,
        habit_id: habit.id,
        todo_id: null
    }
    const slipUp = {
        amount: habit.amount,
        habit_id: habit.id,
        todo_id: null,
        sicko_mode: habit.sicko_mode
      }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = await dispatch(createNewJournal(newJournalEntry))
        .then(()=>{
            if(!habit.is_build){
            dispatch(createIncompleteLog(slipUp))
            }
        })
        if (data && data.error) {
          setErrors(data.error);
        } else {
          closeModal();
        }
      };
      const skipJournal = async (e) => {
        e.preventDefault();
        
        const data = await dispatch(createIncompleteLog(slipUp))
        if (data && data.error) {
          setErrors(data.error);
        } else {
          closeModal();
        }
      };

  
    return (
      <div className="create-journal-modal">

        <h1>{habit.name} -  New Journal</h1>

        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>

          <div className="questions-and-buttons">
          
          <div className="journal-modal-questionaire">
          <label className="journal-header">Why did you fail?</label>
            <textarea
              className="journal-input"
              type="textarea"
              value={whyMissed}
              onChange={(e) => setWhyMissed(e.target.value)}
              required
            />
          </div>

            <div className="journal-modal-questionaire">
          <label className="journal-header"> What Future Action will you take to succeed?</label>
            <textarea
            className="journal-input"
              type="textarea"
              value={futureAction}
              onChange={(e) => setFutureAction(e.target.value)}
              required
            />
            </div>
          
          <div className="modal-journal-buttons">
          <button type="submit">Submit</button>
          <button onClick={skipJournal}>skip and fail</button>
          <button onClick={closeModal}>cancel</button>
          </div>

          </div>

        </form>
      </div>
    );
  }
  
  export default CreateJournalModal;
  