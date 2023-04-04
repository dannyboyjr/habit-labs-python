import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns-tz';


import './StatsBar.css';

const StatsBar = () => {
  const [totalOnTheLine, setTotalOnTheLine] = useState(0);
  const [moneyLostWeekly, setMoneyLostWeekly] = useState(0);
  const todos = useSelector(state => state.todos);
  const habits = useSelector(state => state.habits);
  const checkins = useSelector(state => state.checkins);
  const incompleteLogs = useSelector(state => state.incomplete_logs);
  const checkinsArr = Object.values(checkins);
  const incompleteLogsArr = Object.values(incompleteLogs);
  const session = useSelector(state => state.session);

  useEffect(() => {
    let total = 0;
 
    // const currentDate = new Date().toLocaleDateString("en-US", { timeZone: session.user.timezone });


    Object.values(todos).forEach(todo => {
      if (todo.is_complete) return;

      const date = new Date(todo.due_date);
      // const formattedDate = format(date, 'M/d/yyyy h:mm a', { timeZone: session.user.timezone });

      // console.log("currentDate")
      // console.log(todo.due_date)
      // console.log("formatedDate")
      // console.log(formattedDate)

      // if(currentDate !== formattedDate) return;

      const amount = parseFloat(todo.amount);
      if (!isNaN(amount)) {
        total += amount;
      }
    });
    Object.values(habits).forEach(habit => {
      if (habit.is_build == false) return;
      const checkedHabit = checkinsArr.find(checkin => checkin.habit_id === habit.id);
      if (!checkedHabit) {
        const amount = parseFloat(habit.amount);
        if (!isNaN(amount)) {
          total += amount;
        }
      }
    });
    setTotalOnTheLine(total);

    let lost = 0;
    incompleteLogsArr.forEach(log => {
      const amount = parseFloat(log.amount);
      if (!isNaN(amount)) {
        lost += amount;
      }
    });
    setMoneyLostWeekly(lost);
  }, [todos, habits, checkins, incompleteLogsArr]);

  return(
    <div >
        <div className='stats-bar-container'>
      <div className='money-on-the-line'>
        <div>${totalOnTheLine}</div>
        <p>On the line Today</p>
      </div>
      <div className='money-lost'>
        <div>${moneyLostWeekly}</div>
        <p>Money lost this week</p>
      </div>
      </div>
    </div>
  )
};

export default StatsBar;