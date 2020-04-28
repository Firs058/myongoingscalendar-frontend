<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center text-center>
            <v-flex xs12 md6 lg4 xl3>
                <v-img
                        :src="webpIsSupported ? '/images/webp/megumin.webp' : '/images/megumin.gif'"
                        max-height="808"
                        max-width="506"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        computed: {
            webpIsSupported: {
                get() {
                    return this.$store.getters.webpIsSupported
                }
            }
        }
    }
</script>
