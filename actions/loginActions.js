/*
 * Reducer actions related with login
 */
import * as types from './types';

export function requestLogin(identity, password) {
    return {
        type: types.LOGIN_REQUEST,
        identity,
        password
    };
}

export function loginFailed() {
    return {
        type: types.LOGIN_FAILED
    };
}

export function onLoginResponse(response) {
    return {
        type: types.LOGIN_RESPONSE,
        response
    };
}

export function enableLoader() {
    return {
        type: types.LOGIN_ENABLE_LOADER
    };
}

export function disableLoader() {
    return {
        type: types.LOGIN_DISABLE_LOADER
    };
}
