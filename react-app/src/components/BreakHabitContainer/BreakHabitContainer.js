import './BreakHabitContainer.css'
import BreakHabitCard from '../BreakHabitCard/BreakhabitCard'

const BreakHabitContainer = ({habits}) => {
    return (
        <div className="general-task-container">
            {
                habits.map((habit) => (
                <BreakHabitCard habit={habit}/>
                ))
            }
        </div>
    )
}

export default BreakHabitContainer
