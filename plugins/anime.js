import Vue from 'vue'

const
    API_URL = 'api/public/',
    USER_API_URL = 'api/user/';

export default ({app}) => {
    Vue.prototype.$anime = {
        api: (URL, payload) =>
            new Promise((resolve, reject) => {
                app.$axios.post(API_URL + URL, payload)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve(response)
                            : reject({code: response.data.status.code}))
                    .catch(() => reject({code: 10015}))
            }),
        userApi: (URL, payload) =>
            new Promise((resolve, reject) => {
                app.$axios.post(USER_API_URL + URL, payload)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve(response)
                            : reject({code: response.data.status.code}))
                    .catch(() => reject({code: 10015}))
            })
    };
}
