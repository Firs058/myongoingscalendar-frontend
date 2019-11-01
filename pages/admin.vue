<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <loading v-if="loading"/>
    <v-container
            v-else
            fluid
            fill-height
            :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
    >
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm12 md8 lg6 xl6>
                <v-card tile>
                    <v-card-text>
                        <v-btn
                                v-for="(button, index) in buttons"
                                :key="index"
                                text
                                @click.native="adminRequest(button.path)"
                        >
                            {{button.name}}
                        </v-btn>
                    </v-card-text>
                    <v-data-table
                            :headers="list.headers"
                            :items="list.items"
                            :options="options"
                            hide-default-footer
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
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon
                                    small
                                    class="mr-2"
                                    @click="editItem(item)"
                            >
                                {{icons.mdiPencil}}
                            </v-icon>
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
                            <v-btn text @click.native="dialog = false">Close</v-btn>
                            <v-btn color="success" text @click.native="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {
        mdiPencil
    } from '@mdi/js';

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post('api/admin/data');
            return {
                options: {
                    itemsPerPage: -1,
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
                        {sortable: false, text: 'English name', value: 'titleen', align: 'center'},
                        {sortable: false, text: 'Actions', value: 'action', align: 'center'}
                    ],
                    item: {
                        aid: '',
                        malid: '',
                        annid: '',
                        tid: '',
                        title: '',
                        titleen: ''
                    }
                },
                buttons: [
                    {
                        path: 'hex',
                        name: 'Force HEX'
                    },
                    {
                        path: 'elastic',
                        name: 'Fill elastic'
                    },
                    {
                        path: 'avatars',
                        name: 'Fill avatars'
                    },
                    {
                        path: 'mal',
                        name: 'Force parse MAL'
                    },
                    {
                        path: 'ann',
                        name: 'Force parse ANN'
                    },
                    {
                        path: 'anidb',
                        name: 'Force parse AniDB'
                    },
                    {
                        path: 'syoboi',
                        name: 'Force parse Syoboi'
                    }
                ],
                icons: {
                    mdiPencil
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
            adminRequest(path) {
                this.loading = true;
                this.$anime.adminApi(path)
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
