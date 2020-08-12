const LOGIN_URL = 'api/auth/login';
const REGISTRATION_URL = 'api/auth/registration';
const RECOVER_URL = 'api/auth/pass/recover';
const CHANGE_PASS_URL = 'api/user/pass/change';
const CHANGE_NICKNAME_URL = 'api/user/nickname/change';
const CHANGE_AVATAR_URL = 'api/user/avatar/change';
const REMOVE_AVATAR_URL = 'api/user/avatar/remove';
const SAVE_SETTINGS_URL = 'api/user/settings/save';

const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

export default (axios) => () => ({
    login: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(LOGIN_URL, params)
                .then(({data: {payload: {email, social, roles, tokens, settings}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({
                            email,
                            social,
                            roles,
                            tokens,
                            settings,
                            code
                        })
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    registration: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(REGISTRATION_URL, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    recover: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(RECOVER_URL, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    changeNickname: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(CHANGE_NICKNAME_URL, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    changePass: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(CHANGE_PASS_URL, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    changeAvatar: ({formData}) =>
        new Promise((resolve, reject) =>
            axios
                .post(CHANGE_AVATAR_URL, formData)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({
                    avatar: payload,
                    code
                }) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    removeAvatar: () =>
        new Promise((resolve, reject) =>
            axios
                .post(REMOVE_AVATAR_URL)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    saveSettings: ({params}) => axios.post(SAVE_SETTINGS_URL, params),

    getSocialAuthorizationUrl: ({provider}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`api/auth/${provider}/url`)
                .then(({data: {payload}}) => resolve({url: payload}))
                .catch(() => reject({code: REJECT_CODE}))),

    socialLogin: ({provider, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`api/auth/${provider}`, params)
                .then(({data: {payload: {email, social, roles, tokens, settings}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({
                            email,
                            social,
                            roles,
                            tokens,
                            settings,
                            code
                        })
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    confirm: ({type, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(type === 'registration' ? `${REGISTRATION_URL}/confirm` : `${RECOVER_URL}/confirm`, params)
                .then(({data: {payload, status: {code}}}) => {
                    if (code >= BREAKOUT_CODE)
                        resolve({
                            code,
                            payload,
                            redirect: !!payload ? '/settings' : '/login'
                        });
                    else if (code === 11004)
                        reject({
                            code,
                            redirect: '/recover'
                        });
                    else reject({
                            code,
                            redirect: '/'
                        });
                })
                .catch(() => reject({code: REJECT_CODE})))
})
