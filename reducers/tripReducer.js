/* Login Reducer
 * handles login states in the app
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/actions/types';

const initialState = {
    user_id: '',
    query: ''
};

export const tripReducer = createReducer(initialState, {
    [types.TRIP_LOAD](state, action) {
        return {
            ...state,
            user_id: action.uid,
            query: action.query
        };
    }
});
