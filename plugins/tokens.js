export default function ({store}) {
    window.onNuxtReady(() => {
        const tokens = store.getters.tempTokens;
        if (!!tokens && !!Object.keys(tokens).length) store.dispatch('setTokens', tokens);
        else if (!store.getters.user.authenticated) store.dispatch('setTokens', {});
    })
}
