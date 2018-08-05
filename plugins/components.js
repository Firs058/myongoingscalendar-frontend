import Vue from 'vue'
import Calendar from '~/components/calendar'
import Social from '~/components/social'
import Loading from '~/components/loading'
import Card from '~/components/card'
import Comment from '~/components/comment'
import CommentDialog from '~/components/commentDialog'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueRecaptcha from 'vue-recaptcha'

Vue.component('loading', Loading);
Vue.component('calendar', Calendar);
Vue.component('social', Social);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('card', Card);
Vue.component('vue-recaptcha', VueRecaptcha);
Vue.component('comment', Comment);
Vue.component('comment-dialog', CommentDialog);