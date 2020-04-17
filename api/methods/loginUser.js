import Api from 'app/api';
import ApiConstants, { getUrl } from '../ApiConstants';

export default async function loginUser(identity, password) {
    let url;
    await getUrl().then(value=>{
        url = value;
    });
    console.log('ini url');
    console.log(url);
    var params = {
        "identity": identity,
        "password": password,
        "role": "TRANSPORTER"
    };

    return Api(
        url.login,
        params,
        'post',
        null
    );
}
