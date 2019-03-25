const nodeExternals = require('webpack-node-externals');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
    env: {
        baseUrl: baseUrl
    },
    head: {
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/images/icons/favicon.ico'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'}
        ]
    },
    plugins: [
        {src: '~/plugins/tokens', mode: 'client'},
        {src: '~/plugins/toast.js', mode: 'client'},
        {src: '~/plugins/anime.js', mode: 'client'},
        {src: '~/plugins/sharing.js', mode: 'client'},
        {src: '~/plugins/ga.js', mode: 'client'},
        '~/plugins/axios.js',
        '~/plugins/auth.js',
        '~/plugins/persistedstate.js',
        '~/plugins/components.js',
        '~/plugins/moment.js',
        '~/plugins/clipboard.js',
        '~/plugins/vuetify.js',
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
    css: [
        '~/assets/style/app.styl'
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        'nuxt-device-detect'
    ],
    loading: {
        color: '#1976d2'
    },
    router: {
        middleware: ['sync', 'i18n']
    },
    build: {
        transpile: [/^vuetify/],
        publicPath: '/dist/',
        plugins: [
            new VuetifyLoaderPlugin(),
            new MomentLocalesPlugin({
                localesToKeep: ['ru'],
            })
        ],
        extend(config, ctx) {
            if (process.server) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    }
}
