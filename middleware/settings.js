export default ({store, $axios}) => {
    if (!store.getters.authenticated)
        store.dispatch('setTimezoneToSystem');

    if (!store.getters.synced && !!store.getters.accessToken)
        return $axios({
            method: 'post',
            url: `${process.env.baseUrl}/api/user/sync`,
            timeout: 10000
        }).then(response => {
            if (response.data.status.code >= 11000) {
                store.dispatch('setSettings', response.data.payload);
                store.dispatch('setSynced', true);
            }
        })
}
