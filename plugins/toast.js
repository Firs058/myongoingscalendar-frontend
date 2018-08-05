import Vue from 'vue'

export default ({store}) => {
    Vue.prototype.$toast = {
        showToast: v => {
            v.active = true;
            v.timeout = 6000;
            v.color = v.code >= 11000 ? 'success' : 'error';
            store.dispatch('setToast', v)
        }
    }
}

