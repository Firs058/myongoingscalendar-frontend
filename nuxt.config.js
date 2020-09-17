const RECAPTCHA_SITE_KEY = '6LdMemkUAAAAAEhtdLuLej6GkuS89V0smYUo3DjC';
const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

module.exports = {
    env: {
        RECAPTCHA_SITE_KEY,
        BASE_URL
    },
    head: {
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {name: 'google-site-verification', content: 'XYNXmJI5XPFQwvDE04hZnZ_NFN1p3ighYHzA0uvPmCI'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/images/icons/favicon.ico'}
        ]
    },
    plugins: [
        {src: '~/plugins/ready.js', mode: 'client'},
        {src: '~/plugins/sharing.js', mode: 'client'},
        {src: '~/plugins/scroll.js', mode: 'client'},
        {src: '~/plugins/shared-mutations.js', mode: 'client'},
        '~/plugins/axios.js',
        '~/plugins/api.js',
        '~/plugins/persistedstate.js',
        '~/plugins/components.js',
        '~/plugins/dayjs.js',
        '~/plugins/clipboard.js',
        '~/plugins/i18n.js',
        '~/plugins/font-awesome.js',
        '~/plugins/async.js'
    ],
    axios: {
        baseURL: `${BASE_URL}/api/`,
        browserBaseURL: `${BASE_URL}/api/`
    },
    buildModules: [
        '@nuxtjs/axios',
        '@nuxtjs/vuetify',
        '@nuxtjs/google-analytics',
        '@nuxtjs/dayjs',
        'nuxt-device-detect'
    ],
    googleAnalytics: {
        id: 'UA-97415670-1',
        ignoreRoutes: ['/admin'],
        dev: false
    },
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
            iconfont: "mdiSvg"
        }
    },
    build: {
        publicPath: '/dist/',
        extend(config) {
            config.externals = {moment: 'moment'}
        }
    }
};
