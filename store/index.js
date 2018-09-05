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
            avatar: '',
            role: 'user',
            nickname: 'Anonymous'
        },
        settings: {
            timezone: jstz.determine().name(),
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
                panel: false,
                input: ''
            },
            global: {
                panel: false,
                input: ''
            }
        },
        comment: {
            dialog: false,
            id: 0,
            tid: 0,
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
        SET_NICKNAME: (state, string) => state.user.nickname = string,
        SET_AVATAR: (state, string) => state.user.avatar = string,
        SET_COMMENT: (state, obj) => state.comment = obj,
        SET_COMMENT_DIALOG: (state, bool) => state.comment.dialog = bool,
        SET_SYNCED: (state, bool) => state.synced = bool,
        SET_ONGOINGS_LIST: (state, obj) => state.ongoingsList = obj,
        SET_CALENDAR: (state, obj) => state.calendar = obj,
        SET_TIMEZONES: (state, obj) => state.timezones = obj,
        SET_LANG: (state, string) =>  state.settings.lang = string
    },
    actions: {
        setUser: ({commit}, obj) => commit('SET_USER', obj),
        setDark: ({commit}, bool) => commit('SET_DARK', bool),
        setHideRepeats: ({commit}, bool) => commit('SET_HIDE_REPEATS', bool),
        setTimezone: ({commit}, string) => commit('SET_TIMEZONE', string),
        serFullTimeFormat: ({commit}, bool) => commit('SET_FULL_TIME_FORMAT', bool),
        setSettings: ({commit}, obj) => commit('SET_SETTINGS', obj),
        setToast: ({commit}, obj) => commit('SET_TOAST', obj),
        setToastActive: ({commit}, bool) => commit('SET_TOAST_ACTIVE', bool),
        setSearchListInput: ({commit}, string) => commit('SET_SEARCH_LIST_INPUT', string),
        setSearchGlobalInput: ({commit}, string) => commit('SET_SEARCH_GLOBAL_INPUT', string),
        setNickname: ({commit}, string) => commit('SET_NICKNAME', string),
        setAvatar: ({commit}, string) => commit('SET_AVATAR', string),
        setComment: ({commit}, obj) => commit('SET_COMMENT', obj),
        setCommentDialog: ({commit}, bool) => commit('SET_COMMENT_DIALOG', bool),
        setSynced: ({commit}, bool) => commit('SET_SYNCED', bool),
        setOngoingsList: ({commit}, obj) => commit('SET_ONGOINGS_LIST', obj),
        setCalendar: ({commit}, obj) => commit('SET_CALENDAR', obj),
        setTimezones: ({commit}, obj) => commit('SET_TIMEZONES', obj),
        setLang: ({commit}, string) => commit('SET_LANG', string),
    }
});

export default store