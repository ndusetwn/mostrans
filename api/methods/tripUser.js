import Api from 'app/api';
import ApiConstants from '../ApiConstants';

export default function loadAllTrip(uid, query) {
    var params = {
        "user_id": uid,
        "query": query,
    };

    return Api(
        ApiConstants.SELECT,
        params,
        'post',
        null
    );
}
