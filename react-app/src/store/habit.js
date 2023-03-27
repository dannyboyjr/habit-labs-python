const LOAD_USER_HABITS = "habits/loadUserHabits";
const LOAD_HABIT_BY_ID = 'habits/loadHabitsById'
const CREATE_HABIT = 'habits/createHabit'
const DELETE_HABIT = 'habits/deleteHabit'

const loadUserhabits = (habits) => ({
    type: LOAD_USER_HABITS,
    habits
});

const loadHabitById = (habit) => ({
    type: LOAD_HABIT_BY_ID,
    habit
});

const createHabit = (habit) => ({
    type: CREATE_HABIT,
    habit
})

const deleteHabit = (habit) => ({
    type: DELETE_HABIT,
    habit
})

export const getAllUserHabits = () => async (dispatch) => {
    const response = await fetch('/api/habits/current');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadUserhabits(data));
        return data;
    } 
};

export const getHabitById = (habitId) => async (dispatch) => {
    const response = await fetch(`/api/habits/${habitId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadHabitById(data));
    }
};


export const createAHabit = (habit) => async (dispatch) => {
    const response = await fetch("/api/habits/", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(habit)
    });
    if (response.ok) {
        const habit = await response.json();
        return dispatch(createHabit(habit))
    }
    return response
};

export const editHabitById = (habit_id, habit) => async (dispatch) => {
    const response = await fetch(`/api/habits/${habit_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(habit),
    });
    if (response.ok) {
        const habit = await response.json();
        dispatch(createHabit(habit));
    }
};

export const deleteHabitById = (id) => async (dispatch) => {
    const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteHabit(id))
    }
};



const initialState = {};

const habitsReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type) {
        case LOAD_USER_HABITS:
            action.habits.forEach(habit => {
                newState[habit.id] = habit;
            });
            return newState;
        case LOAD_HABIT_BY_ID:
            newState[action.habit.id] = action.habit;
            return newState;
        case CREATE_HABIT:
            newState = { ...state }
            newState[action.habit.id] = action.habit
            return newState;
        case DELETE_HABIT:
            newState = {...state}
            delete newState[action.habit]
            return newState

        default:
            return state;
        }
}

export default habitsReducer;