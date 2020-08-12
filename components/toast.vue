<template>
    <v-snackbar
            left
            :color="toast.color"
            :class="toast.class"
            v-model="toast.active"
    >
        {{$t("status." + toast.code)}}
        <template v-slot:action>
            <v-btn
                    text
                    icon
                    @click.native="$store.dispatch('setToastActive', false)"
                    :aria-label="$t('menu.exit')"
            >
                <v-icon>{{icons.mdiClose}}</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
    import {icons} from '../mixins/icons'
    import {mapGetters} from 'vuex'

    export default {
        mixins: [
            icons
        ],
        computed: {
            ...mapGetters([
                'toast'
            ])
        }
    }
</script>
