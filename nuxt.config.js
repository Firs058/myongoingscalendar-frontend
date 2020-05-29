const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const recaptchaSitekey = '6LdMemkUAAAAAEhtdLuLej6GkuS89V0smYUo3DjC';
const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

module.exports = {
    env: {
        baseUrl,
        recaptchaSitekey
    },
    head: {
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/images/icons/favicon.ico'}
        ]
    },
    plugins: [
        {src: '~/plugins/ready.js', mode: 'client'},
        {src: '~/plugins/sharing.js', mode: 'client'},
        {src: '~/plugins/scroll.js', mode: 'client'},
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
        baseURL: baseUrl,
        browserBaseURL: baseUrl,
    },
    proxy: {
        '/api': `${baseUrl}/api`
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
