import axios from "axios";


export const FETCH_TASKS_REQUEST = "FETCH_TASKS_REQUEST";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILURE = "FETCH_TASKS_FAILURE";
export const REMOVE_TASK = "REMOVE_TASK";


export const fetchTasksRequest = () => ({
    type: FETCH_TASKS_REQUEST
})

export const fetchTasksSuccess = (tasks) => ({
    type: FETCH_TASKS_SUCCESS,
    payload: tasks,
})

export const fetchTasksFailure = (error) => ({
    type: FETCH_TASKS_FAILURE,
    payload: error,
})

export const removeTask = (taskId) => ({
    type: REMOVE_TASK,
    payload: taskId,
})

export const getTasks = () => {
    return async (dispatch) => {
        dispatch(fetchTasksRequest());
        try {
            const response = await axios.get("http://localhost:8000/api/tasks/allTasks", {withCredentials: true});
            if (response.data) {
                console.log(response.data)
                dispatch(fetchTasksSuccess(response.data));
            }
        } catch (error) {
            dispatch(fetchTasksFailure(error));
        }
    }
}