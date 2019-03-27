import axios from 'axios'

export default ({store, $axios, redirect}) => {
    $axios.onRequest(config => {
        const accessTokenExpDate = store.getters.tokens.expires_in - 1;
        const nowTime = Math.floor(new Date().getTime() / 1000);

        if (store.getters.tokens && accessTokenExpDate <= nowTime)
            return refreshTokens(config, store.getters.tokens.refreshToken);
        else
            return setHeaders(config, store.getters.tokens.accessToken);
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
                    redirect('/login');
                } else {
                    store.dispatch('setTokens', response.data.payload.tokens);
                    store.dispatch('setTempTokens', response.data.payload.tokens);
                    return response.data.payload.tokens.accessToken;
                }
            })
            .then(accessToken => setHeaders(config, accessToken))
            .catch(() => setHeaders(config))
    }

    function setHeaders(config, accessToken) {
        accessToken
            ? config.headers = {'Authorization': `Bearer ${accessToken}`, 'Accept-Language': store.state.settings.lang}
            : config.headers = {'Accept-Language': store.state.settings.lang};
        return config;
    }
}
