<template>
    <loading/>
</template>

<script>
    export default {
        async asyncData(ctx) {
            return {
                token: ctx.query.token,
                type: ctx.params.type
            }
        },
        head() {
            return {
                title: this.type === 'registration'
                    ? this.$t("meta_info.confirm.title.1", ['| MyOngoingsCalendar'])
                    : this.$t("meta_info.confirm.title.2", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.confirm.meta.description", ['MyOngoingsCalendar']),
                    }
                ]
            }
        },
        mounted() {
            if (this.token) {
                const params = {token: this.token};
                this.$auth.confirm({type: this.type, params})
                    .then(({code, payload, redirect}) => {
                        this.$store.dispatch('setUserAndTokensAndSettings', payload);
                        this.$toast.showToast({code});
                        this.$router.push(redirect)
                    })
                    .catch(({code, redirect}) => {
                        this.$toast.showToast({code});
                        this.$router.push(redirect)
                    });
            } else this.$toast.showToast({code: 10014})
        },
        middleware: ['guest']
    }
</script>
