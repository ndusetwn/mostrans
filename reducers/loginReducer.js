/* Login Reducer
 * handles login states in the app
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/actions/types';

const initialState = {
    isLoggedIn: false,
    uid: '',
    trid: '',
    identity: '',
    password: ''
};

export const loginReducer = createReducer(initialState, {
    [types.LOGIN_REQUEST](state, action) {
        return {
            ...state,
            identity: action.identity,
            password: action.password
        };
    },
    [types.LOGIN_LOADING_ENDED](state) {
        return { ...state };
    },
    [types.LOGIN_RESPONSE](state, action) {
        return {
            ...state,
            uid: action.response.uid,
            trid: action.response.trid
        };
    },
    [types.LOGIN_FAILED](state) {
        return {
            ...state,
            isLoggedIn: false
        };
    }
});
