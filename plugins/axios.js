import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost',
    timeout: 10000,
    params: {}
});

export default ({store, $axios, $router}) => {
    $axios.onRequest(config => {
        const accessTokenExpDate = store.getters.tokens.expires_in - 1;
        const nowTime = Math.floor(new Date().getTime() / 1000);

        if (store.getters.tokens && accessTokenExpDate <= nowTime)
            return refreshTokens(config, store.getters.tokens.refreshToken);
        else
            return setHeaders(config, store.getters.tokens.accessToken);
    });

    $axios.onResponse(config => {
        if (store.getters.tokens && config.data.status.code === 12000)
            return refreshTokens(config, store.getters.tokens.refreshToken);
        else if (config.data.status.code === 11017) {
            store.dispatch('setUserToDefault');
            $router.push('/login');
            return config;
        }
    });

    function refreshTokens(config, refreshToken) {
        return instance.post('/api/auth/refresh', {token: refreshToken})
            .then(response => {
                console.log(response.data.payload.tokens);
                store.dispatch('setTokens', response.data.payload.tokens);
                return response.data.payload.tokens.accessToken;
            })
            .then(accessToken => setHeaders(config, accessToken))
            .catch(() => {
                store.dispatch('setUserToDefault');
                return setHeaders(config);
            })
    }

    function setHeaders(config, accessToken) {
        accessToken
            ? config.headers = {'Authorization': `Bearer ${accessToken}`, 'Accept-Language': store.state.settings.lang}
            : config.headers = {'Accept-Language': store.state.settings.lang};
        return config;
    }
}
