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
                this.$auth.socialLogin(this.provider, creds)
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
        ]),
        mounted() {
            this.initSocialLogin();
        }
    }
</script>
