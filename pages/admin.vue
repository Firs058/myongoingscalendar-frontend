<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <loading v-if="loading"/>
  <v-container v-else fill-height>
    <v-row justify="center">
      <v-col xs="12" md="10" lg="8">
        <v-card tile>
          <v-card-text>
            <v-btn
                v-for="(button, index) in buttons"
                :key="index"
                text
                @click.native="adminRequest(button.path)"
                :aria-label="button.name"
            >
              {{ button.name }}
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
                {{ icons.mdiPencil }}
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit tid {{ list.item.tid }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="AniDB id" v-model="list.item.aid"/>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="MAL id" v-model="list.item.malid"/>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="ANN id" v-model="list.item.annid"/>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Japan name" v-model="list.item.title"/>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="English name" v-model="list.item.titleen"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                  text
                  @click.native="dialog = false"
                  aria-label="Close"
              >
                Close
              </v-btn>
              <v-btn
                  color="success"
                  text
                  @click.native="save"
                  aria-label="Save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mdiPencil
} from '@mdi/js';

export default {
  async asyncData({ app }) {
    const { items } = await app.$anime.getAdminData();
    return {
      options: {
        itemsPerPage: -1,
        sortBy: 'tid'
      },
      list: {
        items,
        headers: [
          { sortable: false, text: 'AniDB id', value: 'aid', align: 'center' },
          { sortable: false, text: 'MAL id', value: 'malid', align: 'center' },
          { sortable: false, text: 'ANN id', value: 'annid', align: 'center' },
          { sortable: false, text: 'Syoboi id', value: 'tid', align: 'center' },
          { sortable: false, text: 'Japan name', value: 'title', align: 'center' },
          { sortable: false, text: 'English name', value: 'titleen', align: 'center' },
          { sortable: false, text: 'Actions', value: 'action', align: 'center' }
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
    };
  },
  data: () => ({
    loading: false,
    dialog: false
  }),
  head() {
    return {
      meta: [
        {
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  },
  methods: {
    editItem(item) {
      this.list.item = item;
      this.dialog = true;
    },
    save() {
      this.dialog = false;
      this.$anime.adminApi({ path: 'update', params: this.list.item })
          .then(({ code }) => this.$toast.showToast({ code }))
          .catch(({ code }) => this.$toast.showToast({ code }));
    },
    adminRequest(path) {
      this.loading = true;
      this.$anime.adminApi({ path })
          .then(({ code }) => this.$toast.showToast({ code }))
          .catch(({ code }) => this.$toast.showToast({ code }))
          .finally(() => this.loading = false);
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
};
</script>
