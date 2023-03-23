const LOAD_HABIT_CHECKINS = "checkins/loadHabitCheckins";
const CREATE_HABIT_CHECKIN = 'checkins/createHabitCheckin'

const loadAllHabitCheckins = (checkins) => ({
    type: LOAD_HABIT_CHECKINS,
    checkins
});

const createHabitCheckin = (checkin) => ({
    type: CREATE_HABIT_CHECKIN,
    checkin
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

const initialState = {

};

const checkinReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type) {
        case LOAD_HABIT_CHECKINS:
            action.checkins.forEach(checkin => {
                newState[checkin.habit_id] = checkin;
            });
            return newState;
        case CREATE_HABIT_CHECKIN:
            newState = { ...state }
            newState[action.checkin.habit_id] = action.checkin
            return newState;
        
        default:
            return state

    }

}

export default checkinReducer;