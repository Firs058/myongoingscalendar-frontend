const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const RECAPTCHA_SITE_KEY = '6LdMemkUAAAAAEhtdLuLej6GkuS89V0smYUo3DjC';
const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

const API_URL = 'api/public';
const USER_API_URL = 'api/user';
const ADMIN_API_URL = 'api/admin';

module.exports = {
    env: {
        BASE_URL,
        API_URL,
        USER_API_URL,
        ADMIN_API_URL,
        RECAPTCHA_SITE_KEY,
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
        '~/plugins/moment.js',
        '~/plugins/clipboard.js',
        '~/plugins/i18n.js',
        '~/plugins/font-awesome.js',
        '~/plugins/async.js'
    ],
    axios: {
        proxy: true,
        baseURL: BASE_URL,
        browserBaseURL: BASE_URL,
    },
    proxy: {
        '/api': `${BASE_URL}/api`
    },
    buildModules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/vuetify',
        'nuxt-device-detect',
        ['@nuxtjs/google-analytics', {
            id: 'UA-97415670-1',
            ignoreRoutes: ['/admin'],
            dev: false
        }]
    ],
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
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: ['ru']
            })
        ]
    }
};
