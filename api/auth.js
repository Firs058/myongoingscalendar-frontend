const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

const AUTH_PREFIX = '/auth';

export default (axios) => () => ({
    login: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${AUTH_PREFIX}/login`, params)
                .then(({data: {payload = null, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({payload, code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    registration: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${AUTH_PREFIX}/registration`, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    recover: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${AUTH_PREFIX}/pass/recover`, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getSocialAuthorizationUrl: ({provider}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${AUTH_PREFIX}/${provider}/url`)
                .then(({data: {payload}}) => resolve({url: payload}))
                .catch(() => reject({code: REJECT_CODE}))),

    socialLogin: ({provider, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${AUTH_PREFIX}/${provider}`, params)
                .then(({data: {payload = null, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({payload, code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    confirm: ({type, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(type === 'registration' ? `${AUTH_PREFIX}/registration/confirm` : `${AUTH_PREFIX}/pass/recover/confirm`, params)
                .then(({data: {payload = null, status: {code}}}) => {
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
