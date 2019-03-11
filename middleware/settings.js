import * as Cookies from 'js-cookie'
import cookie from 'cookie'

export default ({store, $axios, req}) => {

    let getCookie = key => process.client ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key];
    let token = getCookie('token');

    if (!store.state.synced && token)
        return $axios({
            method: 'post',
            url: `${process.env.baseUrl}/api/user/sync`,
            timeout: 10000
        }).then(response => {
            if (response.data.status.code >= 11000) {
                store.dispatch('setSettings', response.data.payload);
                store.dispatch('setSynced', true);
            }
        })
}
