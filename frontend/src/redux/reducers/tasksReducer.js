import {FETCH_TASKS_FAILURE, FETCH_TASKS_REQUEST, FETCH_TASKS_SUCCESS} from "../actions/tasksActions";


const initialState = {
    tasks: [],
    loading: true,
    error: null,
}


const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_TASKS_SUCCESS:
            return {
              ...state,
              tasks: action.payload,
              loading: false,
            };
        case FETCH_TASKS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default: return state;
    }
}

export default tasksReducer;