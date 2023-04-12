import './BuildHabitContainer.css'
import BuildHabitCard from '../BuildHabitCard/BuildHabitCard'
import BuildHabitForm from './BuildHabitForm'
import CompletedBuildHabits from '../CompletedBuildHabits/CompletedBuildHabits'

const BuildHabitContainer = ({habits}) => {

    const isBuildExist = habits.filter((habit)=> {
        return habit.is_build 
    })
    console.log("TEST")
    console.log("TEST")
    console.log("TEST")
    console.log(isBuildExist)

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
              { isBuildExist.length > 0 && <p className="completed-buildhabit-container">completed</p>}

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