import jstz from "jstz";
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = () => new Vuex.Store({
    state: {
        locales: ['en', 'ru'],
        user: {
            authenticated: false,
            email: '',
            social: false,
            roles: ['ROLE_USER'],
            tokens: []
        },
        settings: {
            timezone: jstz.determine().name(),
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
            list: {
                input: ''
            },
            global: {
                input: '',
                extension: false,
                supply: [],
                lastQuery: ''
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
    },
    mutations: {
        SET_USER: (state, obj) => state.user = obj,
        SET_DARK: (state, bool) => state.settings.dark = bool,
        SET_HIDE_REPEATS: (state, bool) => state.settings.hideRepeats = bool,
        SET_TIMEZONE: (state, string) => state.settings.timezone = string,
        SET_FULL_TIME_FORMAT: (state, bool) => state.settings.fullTimeFormat = bool,
        SET_SETTINGS: (state, obj) => state.settings = obj,
        SET_TOAST: (state, obj) => state.toast = obj,
        SET_TOAST_ACTIVE: (state, bool) => state.toast.active = bool,
        SET_SEARCH_LIST_INPUT: (state, string) => state.search.list.input = string,
        SET_SEARCH_GLOBAL_INPUT: (state, string) => state.search.global.input = string,
        SET_SEARCH_EXTENSION: (state, bool) => state.search.global.extension = bool,
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
    },
    actions: {
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
        setTimezone: ({commit}, string) => commit('SET_TIMEZONE', string),
        serFullTimeFormat: ({commit}, bool) => commit('SET_FULL_TIME_FORMAT', bool),
        setSettings: ({commit}, obj) => commit('SET_SETTINGS', obj),
        setToast: ({commit}, obj) => commit('SET_TOAST', obj),
        setToastActive: ({commit}, bool) => commit('SET_TOAST_ACTIVE', bool),
        setSearchListInput: ({commit}, string) => commit('SET_SEARCH_LIST_INPUT', string),
        setSearchGlobalInput: ({commit}, string) => commit('SET_SEARCH_GLOBAL_INPUT', string),
        setSearchGlobalExtension: ({commit}, bool) => commit('SET_SEARCH_EXTENSION', bool),
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
    },
    getters: {
        dark: state => state.settings.dark,
        searchListInput: state => state.search.list.input,
        ongoingsList: state => {
            let list = state.ongoingsList;
            let input = state.search.list.input;
            if (input) {
                let filtered = [];
                input = input.trim().toLowerCase();
                list.forEach(e => {
                    let found = e.animes.filter(e => (e.en ? e.en : e.ja).toLowerCase().includes(input) || (e.ja ? e.ja : e.en).toLowerCase().includes(input));
                    if (found.length) filtered.push({dateStart: e.dateStart, animes: found})
                });
                return filtered
            }
            return list
        },
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
        extension: state => state.search.global.extension,
        lastQuery: state => state.search.global.lastQuery,
        supply: state => state.search.global.supply,
        searchGlobalInput: state => state.search.global.input,
        comment: state => state.comment,
        tokens: state => state.user.tokens
    }
});

export default store
