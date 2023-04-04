const LOAD_ALL_JOURNALS = "journals/loadAllJournals";
const LOAD_JOURNALS_BY_HABIT_ID = "journals/loadJournalsByHabitId";
const LOAD_JOURNALS_BY_TODO_ID = "journals/loadJournalsByTodoId";
const CREATE_JOURNAL = "journals/createJournal";
const DELETE_JOURNAL = "journals/deleteJournal";

const loadAllJournals = (journals) => ({
  type: LOAD_ALL_JOURNALS,
  journals,
});

const loadJournalsByHabitId = (journals) => ({
  type: LOAD_JOURNALS_BY_HABIT_ID,
  journals,
});

const loadJournalsByTodoId = (journals) => ({
  type: LOAD_JOURNALS_BY_TODO_ID,
  journals,
});

const createJournal = (journal) => ({
  type: CREATE_JOURNAL,
  journal,
});

const deleteJournal = (journal) => ({
  type: DELETE_JOURNAL,
  journal,
});

export const getAllJournals = () => async (dispatch) => {
  const response = await fetch("/api/journals/");
  if (response.ok) {
    const data = await response.json();
    dispatch(loadAllJournals(data));
    return data;
  }
};

export const getJournalsByHabitId = (habitId) => async (dispatch) => {
  const response = await fetch(`/api/journal/habits/${habitId}/`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadJournalsByHabitId(data));
    return data;
  }
};

export const getJournalsByTodoId = (todoId) => async (dispatch) => {
  const response = await fetch(`/api/journals/todos/${todoId}/`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadJournalsByTodoId(data));
    return data;
  }
};

export const createNewJournal = (journal) => async (dispatch) => {
  const response = await fetch("/api/journals/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journal),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createJournal(data));
    return data;
  }
};

export const editJournalById = (journal_id, journal) => async (dispatch) => {
  const response = await fetch(`/api/journals/${journal_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journal),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createJournal(data));
    return data;
  }
};

export const deleteJournalById = (journalId) => async (dispatch) => {
  const response = await fetch(`/api/journals/${journalId}/`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteJournal(journalId));
    return true;
  } else {
    return false;
  }
};

const initialState = {};

const journalsReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_ALL_JOURNALS:
      action.journals.forEach((journal) => {
        newState[journal.id] = journal;
      });
      return newState;

    case LOAD_JOURNALS_BY_HABIT_ID:
      action.journals.forEach((journal) => {
        newState[journal.id] = journal;
      });
      return newState;

    case LOAD_JOURNALS_BY_TODO_ID:
      action.journals.forEach((journal) => {
        newState[journal.id] = journal;
      });
      return newState;

    case CREATE_JOURNAL:
      newState = { ...state }
            newState[action.journal.id] = action.journal
            return newState;

    case DELETE_JOURNAL:
      newState = { ...state};
      delete newState[action.journal];
      return newState;

    default:
      return state;
  }
};

export default journalsReducer;
