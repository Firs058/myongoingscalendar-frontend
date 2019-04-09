<template>
    <loading v-if="loading"/>
    <v-container
            v-else
            fluid
            fill-height
            :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
    >
        <v-layout align-center justify-center text-xs-center>
            <v-flex xs12 sm12 md8 lg6 xl6>
                <v-card>
                    <v-card-text>
                        <v-btn
                                flat
                                @click.native="hex"
                        >Force HEX
                        </v-btn>
                        <v-btn
                                flat
                                @click.native="elastic"
                        >Fill elastic
                        </v-btn>
                        <v-btn
                                flat
                                @click.native="avatars"
                        >Fill avatars
                        </v-btn>
                        <v-btn
                                flat
                                @click.native="mal"
                        >Force parse MAL
                        </v-btn>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-data-table
                            :headers="list.headers"
                            :items="list.items"
                            :pagination.sync="pagination"
                            hide-actions
                    >
                        <template
                                slot="items"
                                slot-scope="props"
                        >
                            <td>{{ props.item.aid }}</td>
                            <td>{{ props.item.malid }}</td>
                            <td>{{ props.item.annid }}</td>
                            <td>{{ props.item.tid }}</td>
                            <td>{{ props.item.title }}</td>
                            <td>{{ props.item.titleen }}</td>
                            <td class="justify-center layout px-0">
                                <v-btn icon class="mx-0" @click="editItem(props.item)">
                                    <v-icon color="teal">edit</v-icon>
                                </v-btn>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog v-model="dialog" persistent max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Edit tid {{list.item.tid}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field label="AniDB id" v-model="list.item.aid"/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field label="MAL id" v-model="list.item.malid"/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field label="ANN id" v-model="list.item.annid"/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field label="Japan name" v-model="list.item.title"/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field label="English name" v-model="list.item.titleen"/>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post('api/admin/data');
            return {
                pagination: {
                    rowsPerPage: -1,
                    sortBy: 'tid'
                },
                list: {
                    items: data.payload,
                    headers: [
                        {sortable: false, text: 'AniDB id', value: 'aid', align: 'center'},
                        {sortable: false, text: 'MAL id', value: 'malid', align: 'center'},
                        {sortable: false, text: 'ANN id', value: 'annid', align: 'center'},
                        {sortable: false, text: 'Syoboi id', value: 'tid', align: 'center'},
                        {sortable: false, text: 'Japan name', value: 'title', align: 'center'},
                        {sortable: false, text: 'English name', value: 'titleen', align: 'center'}
                    ],
                    item: {
                        aid: '',
                        malid: '',
                        annid: '',
                        tid: '',
                        title: '',
                        titleen: ''
                    }
                }
            }
        },
        data: () => ({
            loading: false,
            dialog: false
        }),
        methods: {
            editItem(item) {
                this.list.item = item;
                this.dialog = true
            },
            save() {
                this.dialog = false;
                this.$anime.adminApi('update', this.list.item)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
            },
            hex() {
                this.loading = true;
                this.$anime.adminApi('hex')
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loading = false)
            },
            elastic() {
                this.loading = true;
                this.$anime.adminApi('elastic')
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loading = false)
            },
            avatars() {
                this.loading = true;
                this.$anime.adminApi('avatars')
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loading = false)
            },
            mal() {
                this.loading = true;
                this.$anime.adminApi('mal')
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loading = false)
            }
        },
        metaInfo: {
            title: 'Admin | MyOngoingsCalendar',
            meta: [
                {
                    name: 'description',
                    content: 'Admin'
                }
            ]
        },
        middleware: ['authenticated', 'admin']
    }
</script>
