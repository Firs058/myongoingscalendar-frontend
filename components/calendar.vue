<template>
  <v-layout
    row
    wrap
    justify-center
  >
    <v-flex
      v-for="(day, index) in calendar"
      :key="index"
      xs12 md6 lg3 xl2
    >
      <v-subheader>{{day.day}}</v-subheader>
      <v-card>
        <v-list
          three-line
          subheader
          class="pa-0"
        >
          <template v-for="(anime, index) in day.anime">
            <v-list-tile
              avatar
              ripple
              :key="index"
              nuxt
              :to="`/title/${anime.tid}`"
            >
              <v-list-tile-avatar>
                <img :src="anime.image">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{anime.titleen ? anime.titleen : anime.title}}</v-list-tile-title>
                <v-list-tile-sub-title>{{$t('calendar.episode', [anime.episode])}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{$t('calendar.channel', [anime.channel])}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{[anime.time, ["HH:mm"]] | moment(fullTimeFormat)}}
                  <span
                    v-if="anime.shift !== '0'"
                    class="error--text"
                  >{{'&nbsp' + anime.shift}}</span>
                </v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < day.anime.length"/>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data: () => ({}),
    props: ['calendar'],
    computed: mapState({
      fullTimeFormat: state => state.settings.fullTimeFormat ? 'HH:mm' : 'LT'
    })
  }
</script>
