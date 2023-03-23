import './BreakHabitContainer.css'
import BreakHabitCard from '../BreakHabitCard/BreakhabitCard'
import BreakHabitForm from './BreakHabitForm'
const BreakHabitContainer = ({habits}) => {

    return (
        <div className="general-task-container">
            <BreakHabitForm />

            {
                habits.map((habit) => (
                <BreakHabitCard habit={habit}/>
                ))
            }
        </div>
    )
}

export default BreakHabitContainer
