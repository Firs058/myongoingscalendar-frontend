export default function ({store}) {
    window.onNuxtReady(() => {
        const tokens = store.getters.tempTokens;
        if (!!Object.keys(tokens).length) store.dispatch('setTokens', tokens);
    })
}
