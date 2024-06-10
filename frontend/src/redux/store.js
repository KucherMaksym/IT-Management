import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import userReducer from "./reducers/userReducer";
import {thunk} from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

const rootReducer = combineReducers({
    user: userReducer,
});

const composeEnhancers = composeWithDevTools
    ? composeWithDevTools(applyMiddleware(thunk))
    : compose(applyMiddleware(thunk));

const store = createStore(rootReducer, composeEnhancers);

export default store;