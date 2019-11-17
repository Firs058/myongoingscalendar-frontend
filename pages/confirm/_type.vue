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
            if (this.token)
                this.$auth.confirm(this.type, {token: this.token})
                    .then(result => {
                        this.$toast.showToast({code: result.code});
                        this.$router.push(result.redirect)
                    })
                    .catch(result => {
                        this.$toast.showToast({code: result.code});
                        this.$router.push(result.redirect)
                    });
            else this.$toast.showToast({text: 10014})
        },
        middleware: ['guest']
    }
</script>
