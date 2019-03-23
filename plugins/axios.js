import axios from 'axios'

export default ({store, $axios, redirect}) => {
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
            redirect('/login');
            return config;
        }
    });

    function refreshTokens(config, refreshToken) {
        const instance = axios.create({
            baseURL: process.env.baseUrl,
            timeout: 10000,
            params: {}
        });

        return instance.post('/api/auth/refresh', {token: refreshToken})
            .then(response => {
                if (response.data.status.code === 11017 || response.data.status.code === 11012) {
                    store.dispatch('setUserToDefault');
                    return setHeaders(config);
                } else {
                    process.client
                        ? store.dispatch('setTokens', response.data.payload.tokens)
                        : store.dispatch('setTempTokens', response.data.payload.tokens);
                    return setHeaders(config, response.data.payload.tokens.accessToken);
                }
            })
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
