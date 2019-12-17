const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

module.exports = {
    env: {
        baseUrl: baseUrl
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
        {src: '~/plugins/tokens', mode: 'client'},
        {src: '~/plugins/toast.js', mode: 'client'},
        {src: '~/plugins/anime.js', mode: 'client'},
        {src: '~/plugins/sharing.js', mode: 'client'},
        {src: '~/plugins/scroll.js', mode: 'client'},
        {src: '~/plugins/ga.js', mode: 'client'},
        '~/plugins/axios.js',
        '~/plugins/auth.js',
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
        'nuxt-device-detect'
    ],
    loading: false,
    router: {
        middleware: ['sync', 'i18n']
    },
    vuetify: {
        treeShake: true,
        defaultAssets: {
            icons: false
        },
        icons: {
            iconfont: "mdiSvg"
        },
        theme: {
            themes: {
                dark: {
                    primary: '#2196F3',
                }
            },
        },
    },
    build: {
        publicPath: '/dist/',
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: ['ru'],
            })
        ]
    }
}
