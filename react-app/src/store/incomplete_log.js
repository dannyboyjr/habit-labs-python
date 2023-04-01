const LOAD_INCOMPLETE_LOGS = 'incompleteLogs/LOAD_INCOMPLETE_LOGS';
const CREATE_INCOMPLETE_LOG = 'incompleteLogs/CREATE_INCOMPLETE_LOG';

const loadIncompleteLogs = (logs) => ({
    type: LOAD_INCOMPLETE_LOGS,
    logs,
  });
  
  const createIncompleteLogAction = (log) => ({
    type: CREATE_INCOMPLETE_LOG,
    log,
  });


export const getIncompleteLogs = () => async (dispatch) => {
  const response = await fetch('/api/incomplete_logs/');
  if (response.ok) {
    const data = await response.json();
    dispatch(loadIncompleteLogs(data));
    return data;
  }
};

export const createIncompleteLog = (log) => async (dispatch) => {
    const response = await fetch('/api/incomplete_logs/', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(log),
    });
  
    if (response.ok) {
      const log = await response.json();
      dispatch(createIncompleteLogAction(log));
      return log;
    }
    return response;
  };

const initialState = {};

const incompleteLogsReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_INCOMPLETE_LOGS:
      action.logs.forEach((log) => {
        newState[log.id] = log;
      });
      return newState;
    case CREATE_INCOMPLETE_LOG:
      newState = { ...state };
      newState[action.log.id] = action.log;
      return newState;
    default:
      return state;
  }
};

export default incompleteLogsReducer;