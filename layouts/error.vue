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
                        <span class="display-4">404</span>
                    </v-flex>
                    <v-flex>
                        <v-card
                                hover
                                ripple
                                flat
                        >
                            <v-img
                                    src="/images/oops.png"
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
                    >
                        to home page
                    </v-btn>
                </v-layout>
                <v-layout
                        row
                        wrap
                        justify-center
                        v-else-if="error.statusCode === 500"
                >
                    <v-flex xs12>
                        <span class="display-4">Timeout exceeded</span>
                    </v-flex>
                    <v-btn
                            large
                            @click.stop="$router.push('/')"
                            text
                            color="primary"
                    >
                        to home page
                    </v-btn>
                </v-layout>
                <v-layout
                        row
                        wrap
                        justify-center
                        v-else
                >
                    <v-flex xs12>
                        <span class="display-4">An error occurred</span>
                    </v-flex>
                    <v-btn
                            large
                            @click.stop="$router.push('/')"
                            flat
                            color="primary"
                    >
                        to home page
                    </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
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
    }
</script>
