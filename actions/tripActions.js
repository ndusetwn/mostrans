/*
 * Reducer actions related with login
 */
import * as types from './types';

export function getAllTrips(uid, query) {
    console.log("actions" + uid);
    console.log("actions 2" + query);
    return {
        type: types.TRIP_LOAD,
        uid,
        query
    };
}
