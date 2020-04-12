export default store => () => ({
    showToast: v => {
        if (process.client) {
            const dark = store.getters.settings.dark;
            store.dispatch('setToast', {
                active: true,
                timeout: 6000,
                code: v.code,
                color: v.code >= 11000 ? `green ${dark ? 'darken-3' : undefined}` : `red ${dark ? 'darken-3' : undefined}`,
                class: {
                    'white--text': dark,
                    'black--text': !dark
                }
            })
        }
    }
})
