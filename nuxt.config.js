const nodeExternals = require('webpack-node-externals');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const baseUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost' : 'https://myongoingscalendar.eu';

module.exports = {
    env: {
        baseUrl: process.env.BASE_URL || baseUrl
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
        {src: '~/plugins/toast.js', ssr: false},
        {src: '~/plugins/anime.js', ssr: false},
        {src: '~/plugins/sharing.js', ssr: false},
        {src: '~/plugins/ga.js', ssr: false},
        '~/plugins/auth.js',
        '~/plugins/persistedstate.js',
        '~/plugins/components.js',
        '~/plugins/moment.js',
        '~/plugins/clipboard.js',
        '~/plugins/vuetify.js',
        '~/plugins/i18n.js',
        '~/plugins/font-awesome.js',
        '~/plugins/axios.js',
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
        '~/assets/style/app.styl',
        '@fortawesome/fontawesome/styles.css'
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        'nuxt-device-detect'
    ],
    loading: false,
    router: {
        middleware: ['settings', 'i18n']
    },
    build: {
        cssSourceMap: false,
        publicPath: '/dist/',
        babel: {
            plugins: [
                ["transform-imports", {
                    "vuetify": {
                        "transform": "vuetify/es5/components/${member}",
                        "preventFullImport": true
                    }
                }]
            ]
        },
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: ['ru'],
            }),
        ],
        vendor: [
            '~/plugins/vuetify.js',
            'vue-i18n'
        ],
        extractCSS: true,
        extend(config, ctx) {
            if (ctx.isServer) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    }
}
