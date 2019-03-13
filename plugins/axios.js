export default ({store, $axios, $router}) => {
    $axios.onRequest(config => {
        const accessTokenExpDate = store.getters.tokens.expires_in - 1;
        const nowTime = Math.floor(new Date().getTime() / 1000);

        if (store.getters.tokens && accessTokenExpDate <= nowTime)
            $axios.post('/api/auth/refresh', {token: store.getters.tokens.refreshToken})
                .then(response => {
                    store.dispatch('setTokens', response.tokens);
                    return response.tokens.accessToken
                })
                .then(accessToken =>
                    accessToken
                        ? config.headers = {'Authorization': `Bearer ${accessToken}`, 'Accept-Language': store.state.settings.lang}
                        : config.headers = {'Accept-Language': store.state.settings.lang});
        else {
            let accessToken = store.getters.tokens.accessToken;
            accessToken
                ? config.headers = {'Authorization': `Bearer ${accessToken}`, 'Accept-Language': store.state.settings.lang}
                : config.headers = {'Accept-Language': store.state.settings.lang};
        }
    });

    $axios.onResponse(config => {
        if (store.getters.tokens && config.data.status.code === 12000)
            $axios.post('/api/auth/refresh', {token: store.getters.tokens.refreshToken})
                .then(response => store.dispatch('setTokens', response.tokens));
        else if (config.data.status.code === 11017)
            $router.push('/login');
    });
}
