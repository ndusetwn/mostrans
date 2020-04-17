/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call } from 'redux-saga/effects';

import { Alert } from 'react-native';
import loginUser from 'app/api/methods/loginUser';
import * as loginActions from 'app/actions/loginActions';
import * as navigationActions from 'app/actions/navigationActions';
import AsyncStorage from '@react-native-community/async-storage';

// Our worker Saga that logins the user
export default function* loginAsync(action) {
    yield put(loginActions.enableLoader());

    //how to call api
    const response = yield call(loginUser, action.identity, action.password);
    //mock response
    const result =  { success: response.status, 
                      data: { uid: response.data, trid: response.transporter_id }
                    };

    console.log("Data : " + response.data);
    //console.log("Transporter Id : " + response.transporter_id);
    if (result.success == "success") {
        AsyncStorage.setItem('@uid', result.data.uid);
        AsyncStorage.setItem('@trid', result.data.trid);
        yield put(loginActions.onLoginResponse(result.data));
        yield put(loginActions.disableLoader({}));
        yield call(navigationActions.navigateToHome);
    } else {
        yield put(loginActions.loginFailed());
        yield put(loginActions.disableLoader({}));
        setTimeout(() => {
            console.log(result);
            Alert.alert('Information', 'Email, Hp atau Password anda salah');
        }, 200);
    }
}
