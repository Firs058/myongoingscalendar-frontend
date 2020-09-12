<template>
    <loading/>
</template>
<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({}),
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
            initSocialLogin() {
                let params;
                const provider = this.provider;
                switch (provider) {
                    case 'twitter':
                        params = {
                            oauth_token: this.query.oauth_token,
                            oauth_verifier: this.query.oauth_verifier,
                            userSettings: this.settings
                        };
                        break;
                    default:
                        params = {
                            state: this.query.state,
                            code: this.query.code,
                            userSettings: this.settings
                        };
                        break;
                }
                this.$auth.socialLogin({provider, params})
                    .then(({payload, code}) => {
                        if (!!payload) this.$store.dispatch('setUserAndTokensAndSettings', payload);
                        this.$toast.showToast({code});
                    })
                    .then(() => this.$router.push('/'))
                    .catch(({code}) => {
                        this.$toast.showToast({code});
                        this.$router.push('/login')
                    })
            }
        },
        computed: mapGetters([
            'settings'
        ]),
        mounted() {
            this.initSocialLogin();
        }
    }
</script>
