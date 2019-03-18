import Vue from 'vue'

export default ({app}) => {
    Vue.prototype.$anime = {
        api: (URL, payload) => {
            return new Promise((resolve, reject) => {
                app.$axios.post('api/' + URL, payload)
                    .then(response =>
                        response.data.status.code >= 11000
                            ? resolve(response)
                            : reject({code: response.data.status.code}))
                    .catch(() => reject({code: 10015}))
            });
        }
    }
}
