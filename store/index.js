import jstz from "jstz";

export const state = () => ({
    locales: ['en', 'ru'],
    user: {
        authenticated: false,
        email: '',
        social: false,
        roles: ['ROLE_USER'],
        tokens: []
    },
    settings: {
        timezone: '',
        avatar: '',
        dark: true,
        hideRepeats: true,
        fullTimeFormat: true,
        lang: 'en'
    },
    toast: {
        timeout: 0,
        color: '',
        code: 11000,
        active: false
    },
    search: {
        global: {
            supply: [],
            lastQuery: {}
        }
    },
    comment: {
        dialog: false,
        id: 0,
        tid: 0
    },
    synced: false,
    skeleton: {
        main: 'grey'
    },
    ongoingsList: [],
    calendar: [],
    timezones: []
});

export const mutations = {
    SET_USER: (state, obj) => state.user = obj,
    SET_DARK: (state, bool) => state.settings.dark = bool,
    SET_HIDE_REPEATS: (state, bool) => state.settings.hideRepeats = bool,
    SET_TIMEZONE: (state, string) => state.settings.timezone = string,
    SET_FULL_TIME_FORMAT: (state, bool) => state.settings.fullTimeFormat = bool,
    SET_SETTINGS: (state, obj) => state.settings = obj,
    SET_TOAST: (state, obj) => state.toast = obj,
    SET_TOAST_ACTIVE: (state, bool) => state.toast.active = bool,
    SET_SEARCH_SUPPLY: (state, obj) => state.search.global.supply = obj,
    SET_SEARCH_LAST_QUERY: (state, string) => state.search.global.lastQuery = string,
    SET_COMMENT: (state, obj) => state.comment = obj,
    SET_COMMENT_DIALOG: (state, bool) => state.comment.dialog = bool,
    SET_SYNCED: (state, bool) => state.synced = bool,
    SET_ONGOINGS_LIST: (state, obj) => state.ongoingsList = obj,
    SET_CALENDAR: (state, obj) => state.calendar = obj,
    SET_TIMEZONES: (state, obj) => state.timezones = obj,
    SET_LANG: (state, string) => state.settings.lang = string,
    SET_TOKENS: (state, obj) => state.user.tokens = obj
};

export const actions = {
    setUser: ({commit}, obj) => commit('SET_USER', obj),
    setUserToDefault: ({commit}) => commit('SET_USER', {
        authenticated: false,
        email: '',
        social: false,
        tokens: [],
        roles: []
    }),
    setDark: ({commit}, bool) => commit('SET_DARK', bool),
    setHideRepeats: ({commit}, bool) => commit('SET_HIDE_REPEATS', bool),
    setTimezoneToSystem: ({commit}) => commit('SET_TIMEZONE', jstz.determine().name()),
    serFullTimeFormat: ({commit}, bool) => commit('SET_FULL_TIME_FORMAT', bool),
    setSettings: ({commit}, obj) => commit('SET_SETTINGS', obj),
    setToast: ({commit}, obj) => commit('SET_TOAST', obj),
    setToastActive: ({commit}, bool) => commit('SET_TOAST_ACTIVE', bool),
    setSearchGlobalSupply: ({commit}, obj) => commit('SET_SEARCH_SUPPLY', obj),
    setSearchGlobalLastQuery: ({commit}, string) => commit('SET_SEARCH_LAST_QUERY', string),
    setComment: ({commit}, obj) => commit('SET_COMMENT', obj),
    setCommentDialog: ({commit}, bool) => commit('SET_COMMENT_DIALOG', bool),
    setSynced: ({commit}, bool) => commit('SET_SYNCED', bool),
    setOngoingsList: ({commit}, obj) => commit('SET_ONGOINGS_LIST', obj),
    setCalendar: ({commit}, obj) => commit('SET_CALENDAR', obj),
    setTimezones: ({commit}, obj) => commit('SET_TIMEZONES', obj),
    setLang: ({commit}, string) => commit('SET_LANG', string),
    setTokens: ({commit}, obj) => commit('SET_TOKENS', obj)
};

export const getters = {
    dark: state => state.settings.dark,
    ongoingsList: state => state.ongoingsList,
    ongoingsListEmpty: state => !Object.keys(state.ongoingsList).length,
    timezonesListEmpty: state => !Object.keys(state.timezones).length,
    authenticated: state => state.user.authenticated,
    hideRepeats: state => state.settings.hideRepeats,
    timezone: state => state.settings.timezone,
    calendar: state => state.calendar,
    settings: state => state.settings,
    fullTimeFormat: state => state.settings.fullTimeFormat ? 'HH:mm' : 'LT',
    user: state => state.user,
    admin: state => state.user.roles.includes('ROLE_ADMIN'),
    toast: state => state.toast,
    lang: state => state.settings.lang,
    supply: state => state.search.global.supply,
    supplyListEmpty: state => !Object.keys(state.search.global.supply).length,
    lastQuery: state => state.search.global.lastQuery,
    comment: state => state.comment,
    synced: state => state.synced
};

export const strict = false;
