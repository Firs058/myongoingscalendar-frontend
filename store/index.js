import Vue from 'vue'

export const state = () => ({
    locales: ['en', 'ru'],
    user: {
        authenticated: false,
        email: '',
        social: false,
        roles: []
    },
    settings: {
        user: {
            avatar: {},
            nickname: '',
            timezone: '',
            dark: true,
            hideRepeats: true,
            fullTimeFormat: true,
            lang: 'en'
        },
        guest: {
            timezone: '',
            dark: true,
            hideRepeats: true,
            fullTimeFormat: true,
            lang: 'en'
        }
    },
    toast: {
        color: '',
        code: 11000,
        active: false,
        class: {}
    },
    search: {
        global: {
            supply: [],
            lastQuery: {}
        }
    },
    comment: {
        dialog: false,
        valid: true,
        loading: false,
        id: 0,
        tid: 0,
        text: ''
    },
    feedback: {
        dialog: false,
        valid: true,
        loading: false,
        text: ''
    },
    synced: false,
    timezones: [],
    tokens: {},
    tempTokens: {},
    webpIsSupported: true,
    agreeWithTermsAndPolicy: false
});

export const mutations = {
    SET_USER: (state, obj) => state.user = obj,
    SET_SETTING: (state, obj) => state.user.authenticated ? state.settings.user[obj.name] = obj.value : state.settings.guest[obj.name] = obj.value,
    SET_SETTINGS: (state, obj) => state.settings.user = obj,
    SET_TOAST: (state, obj) => state.toast = obj,
    SET_TOAST_ACTIVE: (state, bool) => state.toast.active = bool,
    SET_SEARCH_SUPPLY: (state, obj) => state.search.global.supply = obj,
    SET_SEARCH_LAST_QUERY: (state, string) => state.search.global.lastQuery = string,
    SET_COMMENT: (state, obj) => Array.isArray(obj) ? obj.forEach(e => state.comment[e.name] = e.value) : state.comment[obj.name] = obj.value,
    SET_FEEDBACK: (state, obj) => Array.isArray(obj) ? obj.forEach(e => state.feedback[e.name] = e.value) : state.feedback[obj.name] = obj.value,
    SET_SYNCED: (state, bool) => state.synced = bool,
    SET_TIMEZONES: (state, obj) => state.timezones = obj,
    SET_TOKENS: (state, obj) => state.tokens = obj,
    SET_TEMP_TOKENS: (state, obj) => state.tempTokens = obj,
    SET_WEBP_IS_SUPPORTED: (state, bool) => state.webpIsSupported = bool,
    SET_AGREE_WITH_TERMS_AND_POLICY: (state, bool) => state.agreeWithTermsAndPolicy = bool
};

export const actions = {
    setUser: ({commit}, obj) => commit('SET_USER', obj),
    logout: ({commit, getters}) => {
        commit('SET_USER', {
            authenticated: false,
            email: '',
            social: false,
            roles: []
        });
        commit('SET_TOKENS', {});
        commit('SET_SYNCED', false);
        Vue.prototype.$nuxt.$vuetify.theme.dark = getters.settings.dark;
    },
    setUserAndTokensAndSettings: ({commit, getters}, {email, social, roles, tokens, settings}) => {
        commit('SET_USER', {
            authenticated: true,
            email,
            social,
            roles
        });
        commit('SET_TOKENS', tokens);
        commit('SET_SETTINGS', settings);
        commit('SET_SYNCED', true);
        Vue.prototype.$nuxt.$vuetify.theme.dark = getters.settings.dark;
    },
    setSetting: ({commit}, obj) => commit('SET_SETTING', obj),
    setSettings: ({commit}, obj) => commit('SET_SETTINGS', obj),
    setToast: ({commit}, obj) => commit('SET_TOAST', obj),
    setToastActive: ({commit}, bool) => commit('SET_TOAST_ACTIVE', bool),
    setSearchGlobalSupply: ({commit}, obj) => commit('SET_SEARCH_SUPPLY', obj),
    setSearchGlobalLastQuery: ({commit}, string) => commit('SET_SEARCH_LAST_QUERY', string),
    setComment: ({commit}, obj) => commit('SET_COMMENT', obj),
    setFeedback: ({commit}, obj) => commit('SET_FEEDBACK', obj),
    setSynced: ({commit}, bool) => commit('SET_SYNCED', bool),
    setTimezones: ({commit}, obj) => commit('SET_TIMEZONES', obj),
    setTokens: ({commit}, obj) => commit('SET_TOKENS', obj),
    setTempTokens: ({commit}, obj) => commit('SET_TEMP_TOKENS', obj),
    async addComment({commit, getters}) {
        commit('SET_COMMENT', {name: 'loading', value: true});
        const comment = getters.comment;
        const params = {
            id: comment.id,
            tid: comment.tid,
            text: comment.text
        };

        await this.$anime.addComment({params})
            .then(({code}) => {
                commit('SET_COMMENT', [
                    {name: 'dialog', value: false},
                    {name: 'text', value: ''},
                    {name: 'loading', value: false}
                ]);
                this.$toast.showToast({code})
            })
            .catch(({code}) => this.$toast.showToast({code}));
    },
    async addFeedback({commit, getters}, recaptchaToken) {
        commit('SET_FEEDBACK', {name: 'loading', value: true});
        const params = {
            text: getters.feedback.text,
            recaptchaToken
        };

        await this.$anime.addFeedback({authenticated: getters.authenticated, params})
            .then(({code}) => {
                commit('SET_FEEDBACK', [
                    {name: 'dialog', value: false},
                    {name: 'text', value: ''},
                    {name: 'loading', value: false}
                ]);
                this.$toast.showToast({code})
            })
            .catch(({code}) => this.$toast.showToast({code}));
    },
    openCommentDialog({commit}, obj) {
        commit('SET_COMMENT', [
            {name: 'dialog', value: true},
            {name: 'id', value: !!obj.id ? Number(obj.id) : null},
            {name: 'tid', value: !!obj.tid ? Number(obj.tid) : null}
        ]);
    },
    setWebpIsSupported: ({commit}, bool) => commit('SET_WEBP_IS_SUPPORTED', bool),
    setAgreeWithTermsAndPolicy: ({commit}, bool) => commit('SET_AGREE_WITH_TERMS_AND_POLICY', bool)
};

export const getters = {
    timezonesListEmpty: state => !!state.timezones && !Object.keys(state.timezones).length,
    authenticated: state => state.user.authenticated,
    settings: state => state.user.authenticated ? state.settings.user : state.settings.guest,
    user: state => state.user,
    admin: state => state.user.roles.includes('ROLE_ADMIN'),
    toast: state => state.toast,
    supply: state => state.search.global.supply,
    supplyListEmpty: state => !!state.search.global.supply && !Object.keys(state.search.global.supply).length,
    lastQuery: state => state.search.global.lastQuery,
    comment: state => state.comment,
    feedback: state => state.feedback,
    synced: state => state.synced,
    tokens: state => state.tokens,
    tempTokens: state => state.tempTokens,
    webpIsSupported: state => state.webpIsSupported,
    agreeWithTermsAndPolicy: state => state.agreeWithTermsAndPolicy
};

export const strict = false;
