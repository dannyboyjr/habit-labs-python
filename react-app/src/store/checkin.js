const LOAD_HABIT_CHECKINS = "checkins/loadHabitCheckins";
const CREATE_HABIT_CHECKIN = 'checkins/createHabitCheckin'
const DELETE_CHECKIN_HABIT_ID = 'checkins/deleteCheckinByHabitId'

const loadAllHabitCheckins = (checkins) => ({
    type: LOAD_HABIT_CHECKINS,
    checkins
});

const createHabitCheckin = (checkin) => ({
    type: CREATE_HABIT_CHECKIN,
    checkin
})

const deleteCheckin = (habit_id) => ({
    type: DELETE_CHECKIN_HABIT_ID,
    habit_id
})


export const getAllHabitCheckins = () => async (dispatch) => {
    const response = await fetch(`/api/habits/checkins`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadAllHabitCheckins(data));
        return data;
    } 
};

export const createACheckin = (habit_id) => async (dispatch) => {
    const response = await fetch(`/api/habits/${habit_id}/checkin`, {
        headers: { "Content-Type": "application/json" },
        method: "POST"
    });
    if (response.ok) {
        const checkin = await response.json();
        dispatch(createHabitCheckin(checkin))
        return checkin

    }
    return response
};

export const deleteCheckinByHabitId = (habit_id) => async (dispatch) => {
    const response = await fetch(`/api/habits/checkins/${habit_id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteCheckin(habit_id))
    }
};

const initialState = {

};

const checkinReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type) {
        case LOAD_HABIT_CHECKINS:
            action.checkins.forEach(checkin => {
                if (checkin.habit_id === null) {
                    newState[checkin.todo_id] = checkin;
                } else {
                    newState[checkin.habit_id] = checkin;
                }
            });
            return newState;
        case CREATE_HABIT_CHECKIN:
            newState = { ...state }
            newState[action.checkin.habit_id] = action.checkin
            return newState;

        case DELETE_CHECKIN_HABIT_ID:
            newState = {...state}
            delete newState[action.habit_id]
            return newState
        default:
            return state

    }

}

export default checkinReducer;