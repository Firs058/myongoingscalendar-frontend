import createPersistedState from 'vuex-persistedstate'

export default ({app, store}) => {
    createPersistedState({
        paths: ['tokens', 'settings.guest', 'agreeWithTermsAndPolicy'],
        storage: {
            getItem: (key) => app.$cookies.get(key),
            setItem: (key, value) => app.$cookies.set(key, value),
            removeItem: (key) => app.$cookies.remove(key)
        }
    })(store)
}
