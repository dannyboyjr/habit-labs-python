const LOAD_USER_HABITS = "habits/loadUserHabits";
const LOAD_HABIT_BY_ID = 'habits/loadHabitsById'
const CREATE_HABIT = 'habits/createHabit'
// ? const EDIT_HABIT = 'habits/editHabit' can I use create habit?
const DELETE_HABIT = 'habits/deleteHabit'
const LOAD_JOURNALS_BY_HABIT_ID = 'habits/loadJournalsByHabitId'
// ! const LOAD_JOURNAL_BY_ID = 'habits/loadJournalById'
// ! const CREATE_JOURNAL = 'habits/createJournal'
// ? const EDIT_JOURNAL = 'habits/editJournal'
// ! const DELETE_JOURNAL = 'habits/deleteJournal'


const loadUserhabits = (habits) => ({
    type: LOAD_USER_HABITS,
    habits
});

const loadHabitById = (habits) => ({
    type: LOAD_HABIT_BY_ID,
    habits
});

const createHabit = (habits) => ({
    type: CREATE_HABIT,
    habits
})

const loadHabitJournals = (habits) => ({
    type: LOAD_JOURNALS_BY_HABIT_ID,
    habits
});

const deleteHabit = (habits) => ({
    type: DELETE_HABIT,
    habits
})

export const getAllUserHabits = () => async (dispatch) => {
    const response = await fetch('/api/habits/current');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadUserhabits(data));
        return data;
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
        default:
            return state;
        }
}

export default habitsReducer;