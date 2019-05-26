import jstz from "jstz";

export default ({store, $axios}) => {
    if (!store.getters.settings.timezone.length)
        store.dispatch('setSetting', {name: 'timezone', value: jstz.determine().name()});

    if (!store.getters.synced && !!store.getters.tokens.accessToken)
        return $axios({
            method: 'post',
            url: `${process.env.baseUrl}/api/user/sync`,
            timeout: 10000
        }).then(response => {
            if (response.data.status.code >= 11000) {
                store.dispatch('setUser', {
                    authenticated: true,
                    email: response.data.payload.email,
                    social: response.data.payload.social,
                    roles: response.data.payload.roles
                });
                store.dispatch('setSettings', response.data.payload.settings);
                store.dispatch('setSynced', true);
            }
        })
}
