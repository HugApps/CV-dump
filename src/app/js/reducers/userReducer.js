import types from '../actions/types'

const initState = {
    isFetching: false,
    isAuthenticated: false,
    errorMessage: '',
    info: {
        username: '',
        email: '',
        firstname: '',
        lastname: '',
    },
}

export default (state = initState, action) => {
    switch(action.type) {
        case types.FETCH_REQUEST:
            return {
                ...state,
                ...action.payload,
            }
        case types.FETCH_FAILURE:
            return {
                ...state,
                ...action.payload,
            }
        case types.LOGIN_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: false,
            }
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        case types.LOGIN_FAILURE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}
