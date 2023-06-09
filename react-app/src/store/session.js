// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const EDIT_USER = 'session/EDIT_USER'
const DELETE_USER = "session/DELETE_USER"

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

export const editUser = (user) => ({
    type: EDIT_USER,
     user,
})
const deleteUser = (user) => ({
    type: DELETE_USER,
     user,
})
const initialState = { user: null };


export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const getUser = (id) => async (dispatch) => {
	const response = await fetch(`/api/users/${id}`, {
	  headers: {
		"Content-Type": "application/json",
	  },
	});
	if (response.ok) {
	  const data = await response.json();
	  if (data.errors) {
		return;
	  }
  
	  dispatch(setUser(data));
	}
  };
  


export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (first_name, last_name, username, email, password, timezone) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			first_name, 
			last_name,
			username,
			email,
			password,
			timezone,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};


export const editUserById = (id, user) => async (dispatch) => {
    const response = await fetch(`/api/users/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(user),
    });
    if (response.ok) {
        const user = await response.json();
        dispatch(editUser(user));
    } else {
		const errorData = await response.json();
		return errorData.Error.split(", ");
	  }
};

export const deleteUserById = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(deleteUser(id))
    }
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case EDIT_USER:
            return {user: action.user}

		case DELETE_USER:
			return { user: null };;
		default:
			return state;
	}
}