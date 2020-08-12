import jstz from "jstz";

export default ({store, $axios}) => {
    if (!store.getters.settings.timezone.length)
        store.dispatch('setSetting', {name: 'timezone', value: jstz.determine().name()});

    if (!store.getters.synced && !!store.getters.tokens.accessToken)
        return $axios({
            method: 'post',
            url: `${process.env.BASE_URL}/api/user/sync`,
            timeout: 10000
        }).then(({data: {payload: {email, social, roles, settings}, status: {code}}}) => {
            if (code >= 11000) {
                store.dispatch('setUser', {
                    authenticated: true,
                    email,
                    social,
                    roles
                });
                store.dispatch('setSettings', settings);
                store.dispatch('setSynced', true);
            }
        })
}
