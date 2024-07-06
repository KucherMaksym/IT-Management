import axios from "axios";
import {getTasks} from "./tasksActions";

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_COMPANY_REQUEST = 'FETCH_COMPANY_REQUEST';
export const FETCH_COMPANY_SUCCESS = 'FETCH_COMPANY_SUCCESS';

export const fetchUserRequest = () => ({
    type: FETCH_USER_REQUEST,
});

export const fetchUserSuccess = (user) => ({
    type: FETCH_USER_SUCCESS,
    payload: user,
});

export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

export const fetchCompanyRequest = () => ({
    type: FETCH_COMPANY_REQUEST,
});

export const fetchCompanySuccess = (company) => ({
    type: FETCH_COMPANY_SUCCESS,
    payload: company,
});

export const getProfile = () => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());
        try {
            const response = await axios.get("http://localhost:8000/profile", { withCredentials: true });
            console.log(response.data)
            const user = response.data;
            if (user.isAuthenticated === false) {
                throw new Error("User is not Authenticated");
            }
            dispatch(fetchUserSuccess(user));
            dispatch(findUserCompany());
            dispatch(getTasks())
        } catch (error) {
            dispatch(fetchUserFailure(error.message));
        }
    }
}

export const findUserCompany = () => {
    return async (dispatch) => {
        dispatch(fetchCompanyRequest());
        try {
            const response = await axios.get("http://localhost:8000/api/companies/companyByAdmin", { withCredentials: true });
            if (response.data) {
                dispatch(fetchCompanySuccess({ company: response.data, isAdmin: true }));
            } else {
                const employeeResponse = await axios.get("http://localhost:8000/api/companies/findUserCompany", { withCredentials: true });
                dispatch(fetchCompanySuccess({ company: employeeResponse.data, isAdmin: false }));
            }
        } catch (error) {
            console.error("Failed to fetch company data:", error);
        }
    }
}
