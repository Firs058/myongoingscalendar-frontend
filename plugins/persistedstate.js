import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie';
import cookie from 'cookie'
import {encode, decode} from 'js-base64';

export default ({store, req}) => {
    createPersistedState({
        paths: ['tokens', 'settings.guest', 'agreeWithTermsAndPolicy'],
        storage: {
            getItem: (key) => decode(process.client ? Cookies.get(key) : cookie.parse(req.headers.cookie || '')[key]),
            setItem: (key, value) => !Number.isInteger(value) ? Cookies.set(key, encode(value), {expires: 365}) : undefined,
            removeItem: (key) => Cookies.remove(key)
        }
    })(store)
}
