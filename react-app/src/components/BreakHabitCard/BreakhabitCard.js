import './BreakHabitCard.css'


const BreakHabitCard = ({habit}) => {
    if (habit.is_build) {
        return null;
      }
    return ( 
        <div className='habit-card'>
        {!habit.is_build && <div >
            <h3>{habit.name}</h3>
        </div>}
        </div>
    )
}

export default BreakHabitCard