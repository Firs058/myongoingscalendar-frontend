const RECAPTCHA_SITE_KEY = '6LdMemkUAAAAAEhtdLuLej6GkuS89V0smYUo3DjC';
const GTM_ID = 'GTM-T27HQVX';
const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

module.exports = {
  env: {
    RECAPTCHA_SITE_KEY,
    GTM_ID,
    BASE_URL
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'google-site-verification', content: 'XYNXmJI5XPFQwvDE04hZnZ_NFN1p3ighYHzA0uvPmCI' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/icons/favicon.ico' }
    ]
  },
  plugins: [
    { src: '~/plugins/ready.js', mode: 'client' },
    { src: '~/plugins/infinite-loading.js', mode: 'client' },
    { src: '~/plugins/shared-mutations.js', mode: 'client' },
    { src: '~/plugins/gtm.js', mode: 'client' },
    '~/plugins/axios.js',
    '~/plugins/inject.js',
    '~/plugins/persistedstate.js',
    '~/plugins/components.js',
    '~/plugins/dayjs.js',
    '~/plugins/clipboard.js',
    '~/plugins/i18n.js',
    '~/plugins/font-awesome.js',
    '~/plugins/async.js',
    '~/plugins/sharing.js',
    '~/plugins/scrollbar.js'
  ],
  buildModules: [
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
    '@nuxtjs/dayjs',
    'nuxt-device-detect'
  ],
  dayjs: {
    locales: ['en', 'ru'],
    defaultLocale: 'en'
  },
  css: [
    '~/assets/roboto.css'
  ],
  loading: false,
  router: {
    middleware: ['sync', 'i18n']
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    icons: {
      iconfont: 'mdiSvg'
    }
  },
  build: {
    publicPath: '/dist/',
    extend(config) {
      config.externals = { moment: 'moment' };
    },
    babel:{
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    }
  }
};
