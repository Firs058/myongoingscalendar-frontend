import Vue from 'vue'

const
    LOGIN_URL = 'api/auth/login',
    REGISTRATION_URL = 'api/auth/registration',
    RECOVER_URL = 'api/auth/pass/recover',
    CHANGE_PASS_URL = 'api/user/pass/change',
    CHANGE_NICKNAME_URL = 'api/user/nickname/change',
    SAVE_SETTINGS_URL = 'api/user/settings/save';

export default ({store, $axios, redirect}) => {
    Vue.prototype.$auth = {
        login(creds) {
            return new Promise((resolve, reject) => {
                $axios
                    .post(LOGIN_URL, creds)
                    .then(response => {
                        if (response.data.status.code >= 11000) {
                            this.setUserAndSettings(response.data.payload);
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
                store.dispatch('setUserToDefault');
                store.dispatch('setSynced', false);
                redirect('/');
                resolve()
            }),

        setUserAndSettings: (loginStatus) => {
            store.dispatch('setUser', {
                authenticated: true,
                email: loginStatus.email,
                social: loginStatus.social,
                tokens: loginStatus.tokens,
                roles: loginStatus.roles
            });
            store.dispatch('setSettings', loginStatus.settings)
        },

        saveSettings: settings => $axios.post(SAVE_SETTINGS_URL, settings),

        getSocialAuthorizationUrl: provider =>
            new Promise((resolve, reject) =>
                $axios.post(`api/auth/${provider}/url`)
                    .then(response => resolve(response.data.payload))
                    .catch(() => reject({code: 10015}))),

        socialLogin(provider, creds) {
            return new Promise((resolve, reject) => {
                $axios.post(`api/auth/${provider}`, creds)
                    .then(response => {
                        if (response.data.status.code >= 11000) {
                            this.setUserAndSettings(response.data.payload);
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
                                this.setUserAndSettings(response.data.payload, false);
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
