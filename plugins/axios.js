import axios from 'axios'

export default ({store, $axios, redirect}) => {
    $axios.onRequest(config => {
        const accessTokenExpDate = store.getters.tokens.expires_in - 1;
        const nowTime = Math.floor(new Date().getTime() / 1000);

        config.baseURL = getBaseURLWithApi();

        if (store.getters.tokens && accessTokenExpDate <= nowTime)
            return refreshTokens(config, store.getters.tokens.refreshToken);
        else
            return setHeaders(config, store.getters.tokens.accessToken);
    });

    $axios.onResponse(response => {
        const code = response.data.status.code;
        if (code === 10012 || code === 11017) {
            store.dispatch('logout');
            return redirect('/login')
        }
        return response;
    });

    function getBaseURLWithApi() {
        return process.client ? `${process.env.BASE_URL}/api` : `http://localhost/api`
    }

    function refreshTokens(config, refreshToken) {
        const instance = axios.create({
            baseURL: getBaseURLWithApi(),
            timeout: 10000,
            params: {}
        });

        return instance.post('/auth/refresh', {token: refreshToken})
            .then(({data: {payload: {tokens}, status: {code}}}) => {
                if (code === 11017) {
                    store.dispatch('logout');
                    redirect('/login');
                } else {
                    store.dispatch('setTokens', tokens);
                    store.dispatch('setTempTokens', tokens);
                    return tokens.accessToken;
                }
            })
            .then(accessToken => setHeaders(config, accessToken))
            .catch(() => setHeaders(config))
    }

    function setHeaders(config, accessToken) {
        const langHeader = {'Accept-Language': store.getters.settings.lang};
        accessToken
            ? config.headers = {
                'Authorization': `Bearer ${accessToken}`,
                ...langHeader
            }
            : config.headers = {...langHeader};
        return config;
    }
}
