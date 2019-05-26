import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

export default ({ app, store }) => {
    Vue.use(VueMoment, {moment});
    app.$moment = Vue.moment;
    app.$moment.locale(store.getters.settings.lang);
}
