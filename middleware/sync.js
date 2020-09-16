export default ({store, app}) => {
    if (!store.getters.settings.timezone.length)
        store.dispatch('setSetting', {name: 'timezone', value: app.$dayjs.tz.guess()});

    if (!store.getters.synced && !!store.getters.tokens.accessToken)
        return app.$settings.sync()
            .then(({email, social, roles, settings}) => {
                store.dispatch('setUser', {
                    authenticated: true,
                    email,
                    social,
                    roles
                });
                store.dispatch('setSettings', settings);
                store.dispatch('setSynced', true);
            })
}
