import React, { useState } from "react";
import {editHabitById} from '../../store/habit'
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'
import { useParams } from 'react-router-dom';

function EditBuildhabitModal({habit}) {
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        if(habit.is_build){
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
        }else{
            return null
        }
      }

    const [name, setName] = useState(habit.name)
    const [amount, setAmount] = useState(habit.amount)
    const [endDate, setEndDate] = useState(formatDate(habit.end_date))
    const [sickoMode, setSickoMode] = useState(JSON.parse(habit.sicko_mode))
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    

    const updatedisBuildHabit = {
        name: name,
        amount: amount,
        cadence: habit.cadence,
        created_at: habit.created_at,
        end_date: endDate,
        id: habit.id,
        is_build: habit.is_build,
        sicko_mode: sickoMode,
        user_id: habit.user_id
    }
    const updatedisBreakHabit = {
        name: name,
        amount: amount,
        cadence: habit.cadence,
        created_at: habit.created_at,
        end_date: null,
        id: habit.id,
        is_build: habit.is_build,
        sicko_mode: sickoMode,
        user_id: habit.user_id
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
        const data = await dispatch(editHabitById(habit.id, updatedisBuildHabit))
        console.log(updatedisBuildHabit)
        if (data) {
            const {error} = await data.json()
            setErrors(error);
          } else {
              closeModal()
          }
        };

  
    return (
      <>
        <h1>Edit Habit</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>

          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          { habit.is_build &&
          <label>End Date
            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(formatDate(e.target.value))}
            />
            </label>
          }
          <label>
            Enable Sicko Mode
            <input
              type="checkbox"
              value={sickoMode}
              onChange={(e) => setSickoMode(e.target.checked)}
            />
          </label>
          <button type="submit">Update</button>
        </form>
      </>
    );
  }
  
  export default EditBuildhabitModal;
  