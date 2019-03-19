import axios from 'axios'

export default ({store, $axios, $router}) => {

    const instance = axios.create({
        baseURL: process.env.baseUrl,
        timeout: 10000,
        params: {}
    });

    $axios.onRequest(config => {
        const accessTokenExpDate = store.getters.user.tokens.expires_in - 1;
        const nowTime = Math.floor(new Date().getTime() / 1000);

        if (store.getters.user.tokens && accessTokenExpDate <= nowTime)
            return refreshTokens(config, store.getters.user.tokens.refreshToken);
        else
            return setHeaders(config, store.getters.user.tokens.accessToken);
    });

    $axios.onResponse(config => {
        if (store.getters.user.tokens && config.data.status.code === 12000)
            return refreshTokens(config, store.getters.user.tokens.refreshToken);
        else if (config.data.status.code === 11017) {
            store.dispatch('setUserToDefault');
            $router.push('/login');
            return config;
        }
    });

    function refreshTokens(config, refreshToken) {
        return instance.post('/api/auth/refresh', {token: refreshToken})
            .then(response => {
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
