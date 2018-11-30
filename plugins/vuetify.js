import Vue from 'vue'
import Vuetify, {
    VApp
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    components: {
        VApp
    },
    directives: {
        Ripple
    }
})