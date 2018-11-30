import * as Cookies from 'js-cookie'
import cookie from 'cookie'

export default ({store, $axios, req}) => {
    $axios.onRequest(config => {
        let getCookie = key => process.client ? Cookies.get(key) : cookie.parse(req.headers.cookie || '')[key];
        let token = getCookie('token');
        token
            ? config.headers = {'Authorization': `Bearer ${token}`, 'Accept-Language': store.state.settings.lang}
            : config.headers = {'Accept-Language': store.state.settings.lang};
    });
}