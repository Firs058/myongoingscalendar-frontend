const
    API_URL = 'api/public/',
    USER_API_URL = 'api/user/',
    ADMIN_API_URL = 'api/admin/';

export default axios => () => ({
    api: (URL, payload) =>
        new Promise((resolve, reject) => {
            axios.post(API_URL + URL, payload)
                .then(response =>
                    response.data.status.code >= 11000
                        ? resolve(response)
                        : reject({code: response.data.status.code}))
                .catch(() => reject({code: 10015}))
        }),

    userApi: (URL, payload) =>
        new Promise((resolve, reject) => {
            axios.post(USER_API_URL + URL, payload)
                .then(response =>
                    response.data.status.code >= 11000
                        ? resolve(response)
                        : reject({code: response.data.status.code}))
                .catch(() => reject({code: 10015}))
        }),

    adminApi: (URL, payload) =>
        new Promise((resolve, reject) => {
            axios.post(ADMIN_API_URL + URL, payload)
                .then(response =>
                    response.data.status.code >= 11000
                        ? resolve(response)
                        : reject({code: response.data.status.code}))
                .catch(() => reject({code: 10015}))
        })
})
