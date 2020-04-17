/* 
 * combines all th existing reducers
 */
import * as loadingReducer from './loadingReducer';
import * as loginReducer from './loginReducer';
import * as tripReducer from './tripReducer';
export default Object.assign(loginReducer, tripReducer, loadingReducer);