import './BuildHabitContainer.css'
import BuildHabitCard from '../BuildHabitCard/BuildHabitCard'
import BuildHabitForm from './BuildHabitForm'
import CompletedBuildHabits from '../CompletedBuildHabits/CompletedBuildHabits'

const BuildHabitContainer = ({habits}) => {

    return (
        <div className="general-task-container">
            <div>
            < BuildHabitForm />
            {
                habits.map((habit) => (
                <BuildHabitCard key={habit.id} habit={habit}/>
                ))
            }
            </div>
            <div>
                <p className="completed-buildhabit-container">completed</p>

            {
                habits.map((habit) => (
                <CompletedBuildHabits key={habit.id} habit={habit}/>
                ))
            }

            </div>
        </div>
        
    )
}

export default BuildHabitContainer