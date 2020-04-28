import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'
import {Base64} from 'js-base64';

export default ({store, req}) => {
    createPersistedState({
        paths: ['tokens', 'settings.guest', 'agreeWithTermsAndPolicy'],
        storage: {
            getItem: (key) => Base64.decode(process.client ? Cookies.getJSON(key) : cookie.parse(req.headers.cookie || '')[key]),
            setItem: (key, value) => Cookies.set(key, Base64.encode(value), {expires: 365}),
            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}
