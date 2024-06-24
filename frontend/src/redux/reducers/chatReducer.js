

const initialState = {
    user: null,
    draft: null,
}

export const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_USER":
            return {...state, user: action.payload};
        case "SET_DRAFT":
            return {...state, draft: action.payload};

        default:
            return state;
    }
}

export default chatReducer;