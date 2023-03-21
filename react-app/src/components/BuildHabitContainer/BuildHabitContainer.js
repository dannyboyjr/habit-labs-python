import './BuildHabitContainer.css'
import BuildHabitCard from '../BuildHabitCard/BuildHabitCard'
import BuildHabitForm from './BuildHabitForm'

const BuildHabitContainer = ({habits}) => {

    return (
        <div className="general-task-container">
            < BuildHabitForm />
            {
                habits.map((habit) => (
                <BuildHabitCard habit={habit}/>
                ))
            }
        </div>
        
    )
}

export default BuildHabitContainer