import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatsBar from "../components/StatsBar/StatsBar";
import BreakHabitContainer from "../components/BreakHabitContainer/BreakHabitContainer";
import BuildhabitContainer from "../components/BuildHabitContainer/BuildHabitContainer";
import TodosContainer from "../components/TodosContainer/TodosContainer";
import {getAllUserHabits} from "../store/habit";
import {getAllHabitCheckins} from '../store/checkin'
import { getAllUserTodos } from '../store/todo'
import { getIncompleteLogs, getSavedStats } from '../store/incomplete_log'
import Footer from '../components/Footer/Footer'
import "./Home.css";
const HomePage = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)
  const habits = useSelector(state => state.habits)
  const habitsArray = Object.values(habits)
  const todos = useSelector(state => state.todos)
  const todoArray = Object.values(todos)
  const userSavedStatsObj = useSelector(state => state.incomplete_logs.stats)

  useEffect(() => {
    dispatch(getAllHabitCheckins())
    dispatch(getAllUserTodos())
    dispatch(getIncompleteLogs())
    dispatch(getSavedStats())
    dispatch(getAllUserHabits()).then(()=>setIsLoaded(true))
	}, [dispatch])

  return (
    <div className="home-page-container">
      <StatsBar stats={userSavedStatsObj}/>
    { isLoaded && 
      <div className="home-page-task-layout">

        <div className="name-task-layout">
          <h3>Break Habits</h3>
          <BreakHabitContainer habits={habitsArray} />
        </div>
        <div className="name-task-layout">
          <h3>Build Habits</h3>
          <BuildhabitContainer habits={habitsArray} />
        </div>
        <div className="name-task-layout">
          <h3>Todos</h3>
          <TodosContainer todos={todoArray} />
        </div>

      </div>
      }
      <Footer />
    </div>
  );
};

export default HomePage;
