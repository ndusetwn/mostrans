// export action creators
import * as loginActions from './loginActions';
import * as tripActions from './tripActions';
import * as navigationActions from './navigationActions';

export const ActionCreators = Object.assign(
    {},
    loginActions,
    tripActions,
    navigationActions
);
