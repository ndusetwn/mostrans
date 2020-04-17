/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call } from 'redux-saga/effects';

import { Alert } from 'react-native';
import loadAllTrip from 'app/api/methods/tripUser';
import * as tripActions from 'app/actions/tripActions';
import * as navigationActions from 'app/actions/navigationActions';
import AsyncStorage from '@react-native-community/async-storage';

// Our worker Saga that logins the user
export default function* tripAsync(action) {

    //how to call api
    const response = yield call(loadAllTrip, action.uid, action.query);
    //mock response

    console.log(response.data);
}
