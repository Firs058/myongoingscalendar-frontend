import Vue from 'vue'
import * as Cookies from 'js-cookie'

const
    LOGIN_URL = 'api/user/login',
    REGISTRATION_URL = 'api/user/registration',
    RECOVER_URL = 'api/user/pass/recover',
    CHANGE_PASS_URL = 'api/user/pass/change',
    CHANGE_NICKNAME_URL = 'api/user/nickname/change',
    SAVE_SETTINGS_URL = 'api/user/settings/save';

export default ({store, $axios, redirect}) => {
    Vue.prototype.$auth = {
        login(creds, remember) {
            return new Promise((resolve, reject) => {
                $axios
                    .post(LOGIN_URL, creds)
                    .then(response => {
                        if (response.data.status.code >= 11000) {
                            this.setUser(response.data.payload, remember);
                            resolve({code: response.data.status.code});
                        } else reject({code: response.data.status.code});
                    })
                    .catch(() => reject({code: 10015}))
            });
        },

        registration: creds =>
            new Promise((resolve, reject) => {
                $axios
                    .post(REGISTRATION_URL, creds)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve({code: response.data.status.code})
                            : reject({code: response.data.status.code})
                    )
                    .catch(() => reject({code: 10015}))
            }),

        recover: creds =>
            new Promise((resolve, reject) => {
                $axios
                    .post(RECOVER_URL, creds)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve({code: response.data.status.code})
                            : reject({code: response.data.status.code})
                    )
                    .catch(() =>
                        reject({code: 10015}))
            }),

        changeNickname: creds =>
            new Promise((resolve, reject) => {
                $axios
                    .post(CHANGE_NICKNAME_URL, creds)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve({code: response.data.status.code})
                            : reject({code: response.data.status.code})
                    )
                    .catch(() => reject({code: 10015}))
            }),

        changePass: creds =>
            new Promise((resolve, reject) => {
                $axios
                    .post(CHANGE_PASS_URL, creds)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve({code: response.data.status.code})
                            : reject({code: response.data.status.code})
                    )
                    .catch(() => reject({code: 10015}))
            }),

        logout: () =>
            new Promise(resolve => {
                Cookies.remove('token');
                store.dispatch('setUser', {
                    authenticated: false,
                    email: '',
                    social: false,
                    avatar: '',
                    roles: ['ROLE_USER'],
                    nickname: 'Anonymous'
                });
                store.dispatch('setSynced', false);
                redirect('/');
                resolve()
            }),

        setUser: (user, remember) => {
            Cookies.set('token', user.token, remember ? {expires: 365} : null);
            store.dispatch('setUser', {
                authenticated: true,
                email: user.email,
                social: user.social,
                avatar: user.avatar ? user.avatar : "/images/anon.png",
                roles: user.roles,
                nickname: user.nickname
            })
        },

        saveSettings: settings => $axios.post(SAVE_SETTINGS_URL, settings),

        getSocialAuthorizationUrl: provider =>
            new Promise((resolve, reject) =>
                $axios.post(`api/auth/${provider}/url`)
                    .then(response => resolve(response.data.payload))
                    .catch(() => reject({code: 10015}))),

        socialLogin(provider, creds, remember) {
            return new Promise((resolve, reject) => {
                $axios.post(`api/auth/${provider}`, creds)
                    .then(response => {
                        if (response.data.status.code >= 11000) {
                            this.setUser(response.data.payload, remember);
                            resolve({code: response.data.status.code});
                        } else reject({code: response.data.status.code});
                    })
                    .catch(() => reject({code: 10015}))
            })
        },

        confirm(type, creds) {
            return new Promise((resolve, reject) => {
                $axios.post(type === 'registration' ? `${REGISTRATION_URL}/confirm` : `${RECOVER_URL}/confirm`, creds)
                    .then(response => {
                        if (response.data.status.code >= 11000)
                            if (response.data.payload) {
                                this.setUser(response.data.payload, false);
                                resolve({
                                    code: response.data.status.code,
                                    redirect: '/settings'
                                })
                            } else resolve({
                                code: response.data.status.code,
                                redirect: '/login'
                            });
                        else if (response.data.status.code === 11004)
                            reject({
                                code: response.data.status.code,
                                redirect: '/recover'
                            });
                        else reject({
                                code: response.data.status.code,
                                redirect: '/'
                            });
                    })
                    .catch(() => reject({code: 10015}))
            })
        }
    }
}
