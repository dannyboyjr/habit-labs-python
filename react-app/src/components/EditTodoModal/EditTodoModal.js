import { useState } from "react";
import { editTodoById } from "../../store/todo";
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal'

function EditTodoModal({todo}) {
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;

      }

    const [name, setName] = useState(todo.name)
    const [amount, setAmount] = useState(todo.amount)
    const [dueDate, setDueDate] = useState(formatDate(todo.due_date))
    const [sickoMode, setSickoMode] = useState(JSON.parse(todo.sicko_mode))
    const [lateFee, setLateFee] = useState(todo.late_fee)
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    

    const editedTodo = {
        name: name,
        amount: amount,
        late_fee: lateFee,
        due_date: dueDate,
        sicko_mode: sickoMode,
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
        const data = await dispatch(editTodoById(todo.id, editedTodo))
        if (data) {
            const {error} = await data.json()
            setErrors(error);
          } else {
              closeModal()
          }
        };

  
    return (
      <>
        <h1>Edit Todo</h1>
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

          <label>
            Daily Late Fee
            <input
              type="number"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              required
            />
          </label>

          <label>Due Date
            <input
              type="date"
              name="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(formatDate(e.target.value))}
            />
            </label>
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
  
  export default EditTodoModal;
  