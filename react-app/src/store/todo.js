const LOAD_USER_TODOS = "todos/loadUserTodo";
const LOAD_TODO_BY_ID = 'todos/loadTodoById'
const CREATE_TODO = 'todos/createTodo'
const DELETE_TODO = 'todos/deleteTodo'
const COMPLETE_TODO = 'todos/completeTodo'

const loadUsertodos = (todos) => ({
    type: LOAD_USER_TODOS,
    todos
});

const loadTodoById = (todo) => ({
    type: LOAD_TODO_BY_ID,
    todo
});

const createTodo = (todo) => ({
    type: CREATE_TODO,
    todo
})
const completeTodo = (todo) => ({
    type: COMPLETE_TODO,
    todo
});

const deleteTodo = (todo) => ({
    type: DELETE_TODO,
    todo
})

export const getAllUserTodos = () => async (dispatch) => {
    const response = await fetch('/api/todos/current');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadUsertodos(data));
        return data;
    } 
};

export const getTodoById = (todo_id) => async (dispatch) => {
    const response = await fetch(`/api/todos/${todo_id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadTodoById(data));
    }
};


export const createATodo = (todo) => async (dispatch) => {
    const response = await fetch("/api/todos/", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(todo)
    });
    if (response.ok) {
        const todo = await response.json();
        return dispatch(createTodo(todo))
    }
    return response
};

export const editTodoById = (todo_id, todo) => async (dispatch) => {
    const response = await fetch(`/api/todos/${todo_id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(todo),
    });
    if (response.ok) {
        const todo = await response.json();
        dispatch(createTodo(todo));
    }
};

export const completeATodo = (todo_id) => async (dispatch) => {
    const response = await fetch(`/api/todos/${todo_id}/complete`, {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
    });
    if (response.ok) {
        const todo = await response.json();
        dispatch(completeTodo(todo));
    }
};

export const deleteTodoById = (todo_id) => async (dispatch) => {
    const response = await fetch(`/api/todos/${todo_id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteTodo(todo_id))
    }
};

const initialState = {};

const todosReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type) {
        case LOAD_USER_TODOS:
            console.log(action.todos)
            action.todos.forEach(todo => {
                newState[todo.id] = todo;
            });
            return newState;
        case LOAD_TODO_BY_ID:
            newState[action.todo.id] = action.todo;
            return newState;
        case CREATE_TODO:
            newState = { ...state }
            newState[action.todo.id] = action.todo
            return newState;
        case COMPLETE_TODO:
            newState = { ...state }
            console.log(action.todo)
            delete newState[action.todo.id] 
            return newState
        case DELETE_TODO:
            newState = {...state}
            delete newState[action.todo]
            return newState

        default:
            return state;
        }
}

export default todosReducer;