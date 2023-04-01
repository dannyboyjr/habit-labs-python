import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import habitsReducer from './habit';
import checkinReducer from './checkin';
import todosReducer from './todo';
import journalsReducer from './journal';
import incompleteLogsReducer from './incomplete_log';

const rootReducer = combineReducers({
  session,
  habits: habitsReducer,
  checkins: checkinReducer,
  todos: todosReducer,
  journals: journalsReducer,
  incomplete_logs: incompleteLogsReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
