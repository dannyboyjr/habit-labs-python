import './BreakHabitCard.css'


const BreakHabitCard = ({habit}) => {
    return ( 
        <div className='habit-card'>
        {!habit.is_build && <div >
            <h3>{habit.name}</h3>
        </div>}
        </div>
    )
}

export default BreakHabitCard