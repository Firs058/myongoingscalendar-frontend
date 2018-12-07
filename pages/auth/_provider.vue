<template>
    <v-container
            fluid
            fill-height
            :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
    >
        <v-layout align-center justify-center text-xs-center>
            <v-dialog
                    persistent
                    v-if="!remember"
                    v-model="dialog"
                    max-width="300"
            >
                <v-card>
                    <v-card-title class="headline">{{$t('login_social.dialog.headline')}}</v-card-title>
                    <v-card-text>{{$t('login_social.dialog.text')}}</v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="error" flat @click.native="initSocialLogin(false)">{{$t('buttons.no')}}</v-btn>
                        <v-btn color="success" @click.native="initSocialLogin(true)">{{$t('buttons.yes')}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            remember: false,
            dialog: true,
        }),
        async asyncData(ctx) {
            return {
                query: ctx.query,
                provider: ctx.params.provider
            }
        },
        head() {
            return {
                title: this.$t("meta_info.login_social.title", [this.provider, '| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.login_social.meta.description", ['MyOngoingsCalendar'])
                    }
                ]
            }
        },
        methods: {
            initSocialLogin(remember) {
                this.dialog = false;
                let creds;
                switch (this.provider) {
                    case 'twitter':
                        creds = {
                            oauth_token: this.query.oauth_token,
                            oauth_verifier: this.query.oauth_verifier,
                            userSettings: this.settings
                        };
                        break;
                    default:
                        creds = {
                            state: this.query.state,
                            code: this.query.code,
                            userSettings: this.settings
                        };
                        break;
                }
                this.$auth.socialLogin(this.provider, creds, remember)
                    .then(code => this.$toast.showToast(code))
                    .then(() => this.$router.push('/'))
                    .catch(code => {
                        this.$toast.showToast(code);
                        this.$router.push('/login')
                    })
            }
        },
        computed: mapGetters([
            'settings'
        ])
    }
</script>
