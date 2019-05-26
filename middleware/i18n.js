export default function ({isHMR, app, store, route, params, error}) {
    if (app.i18n.locale !== store.getters.settings.lang) {
        const defaultLocale = app.i18n.fallbackLocale;
        if (isHMR) return;
        const lang = store.getters.settings.lang || defaultLocale;
        if (store.state.locales.indexOf(lang) === -1) {
            return error({message: 'This page could not be found.', statusCode: 404})
        }
        store.dispatch('setSetting', {name: 'lang', value: lang});
        app.i18n.locale = lang;
        app.$moment.locale(lang);
    }
}
