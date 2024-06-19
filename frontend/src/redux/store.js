import userReducer from "./reducers/userReducer";
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from "./reducers/tasksReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: tasksReducer
    }
})

export default store;