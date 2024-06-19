import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE, FETCH_COMPANY_REQUEST, FETCH_COMPANY_SUCCESS } from '../actions/userActions';

const initialState = {
    user: null,
    loading: true,
    isAuthenticated: false,
    company: {
        company: null,
        isAdmin: false,
        loading: true,
    },
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                isAuthenticated: true,
                error: null,
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                user: null,
                loading: false,
                isAuthenticated: false,
                error: action.payload,
            };
        case FETCH_COMPANY_REQUEST:
            return {
                ...state,
                company: {
                    ...state.company,
                    loading: true,
                },
            };
        case FETCH_COMPANY_SUCCESS:
            return {
                ...state,
                company: {
                    ...action.payload,
                    loading: false,
                },
            };
        default:
            return state;
    }
};

export default userReducer;
