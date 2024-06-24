import userReducer from "./reducers/userReducer";
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from "./reducers/tasksReducer";
import chatReducer from "./reducers/chatReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: tasksReducer,
        chat: chatReducer,
    }
})

export default store;