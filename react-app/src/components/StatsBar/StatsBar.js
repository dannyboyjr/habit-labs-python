import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


import './StatsBar.css';

const StatsBar = ({stats}) => {
  const [totalOnTheLine, setTotalOnTheLine] = useState(0);
  const todos = useSelector(state => state.todos);
  const habits = useSelector(state => state.habits);
  const checkins = useSelector(state => state.checkins);
  const incompleteLogs = useSelector(state => state.incomplete_logs.logs);
  const checkinsArr = Object.values(checkins);
  const incompleteLogsArr = Object.values(incompleteLogs);

  useEffect(() => {

    //ALL this calcualtes the Online line today
    let total = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    Object.values(todos).forEach(todo => {
      if (todo.is_complete) return;

      const dueDate = new Date(todo.due_date);
      if (dueDate > today) return;

      const amount = parseFloat(todo.amount);
      if (!isNaN(amount)) {
        total += amount;
    }
    });
    Object.values(habits).forEach(habit => {
      if (habit.is_build === false) return;
      const checkedHabit = checkinsArr.find(checkin => checkin.habit_id === habit.id);
      if (!checkedHabit) {
        const amount = parseFloat(habit.amount);
        if (!isNaN(amount)) {
          total += amount;
        }
      }
    });
    setTotalOnTheLine(total);

 
  }, [todos, habits, checkins, incompleteLogsArr, checkinsArr ]);

  return(
    <div className="stats-bar" >
        <div className='stats-bar-container' >
      <div className='money-on-the-line' id="on-the-line-today">
        <div>${totalOnTheLine}</div>
        <p>On the line Today</p>
      </div>
      <div className='money-lost' id="money-lost-id">
        <div>${stats.total_saved_week}</div>
        <p>Money saved this week</p>
      </div>
      <div className='money-lost'id="money-lost-id">
        <div>${stats.total_lost_week}</div>
        <p>Money lost this week</p>
      </div>
      </div>
    </div>
  )
};

export default StatsBar;