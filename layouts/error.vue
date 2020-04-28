<template>
    <v-container
            fluid
            fill-height
            :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
    >
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm12 md4 lg4 xl3>
                <v-layout
                        column
                        wrap
                        justify-center
                        v-if="error.statusCode === 404"
                >
                    <v-flex>
                        <h1>404</h1>
                    </v-flex>
                    <v-flex>
                        <v-card
                                hover
                                ripple
                                flat
                        >
                            <v-img
                                    :src="webpIsSupported ? '/images/webp/oops.webp' : '/images/oops.png'"
                                    aspect-ratio="1"
                                    height="600px"
                            >
                                <v-layout
                                        slot="placeholder"
                                        fill-height
                                        align-center
                                        justify-center
                                        class="ma-0"
                                >
                                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                            </v-img>
                        </v-card>
                    </v-flex>
                    <v-btn
                            large
                            @click.stop="$router.push('/')"
                            text
                            color="primary"
                            aria-label="to home page"
                    >
                        to home page
                    </v-btn>
                </v-layout>
                <v-layout
                        column
                        wrap
                        justify-center
                        v-else-if="error.statusCode === 500"
                >
                    <h1>Timeout exceeded</h1>
                    <v-btn
                            large
                            @click.stop="$router.push('/')"
                            text
                            color="primary"
                            aria-label="to home page"
                    >
                        to home page
                    </v-btn>
                </v-layout>
                <v-layout
                        column
                        wrap
                        justify-center
                        v-else
                >
                    <h1>An error occurred</h1>
                    <v-btn
                            large
                            @click.stop="$router.push('/')"
                            text
                            color="primary"
                            aria-label="to home page"
                    >
                        to home page
                    </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <toast/>
    </v-container>
</template>

<script>
    export default {
        props: ['error'],
        head() {
            return {
                title: 'Error | MyOngoingsCalendar',
                meta: [
                    {
                        name: 'description',
                        content: 'error'
                    }
                ]
            }
        },
        computed: {
            webpIsSupported: {
                get() {
                    return this.$store.getters.webpIsSupported
                }
            }
        },
        mounted() {
            this.$toast.showToast({code: this.error.code})
        }
    }
</script>
