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

    $axios.onResponse(config => {
        if (store.getters.tokens && config.data.status.code === 12000)
            return refreshTokens(config, store.getters.tokens.refreshToken);
        else if (config.data.status.code === 11017 || config.data.status.code === 10012) {
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
                store.dispatch('setTokens', response.data.payload.tokens);
                store.dispatch('setTempTokens', response.data.payload.tokens);
                return setHeaders(config, response.data.payload.tokens.accessToken);
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
