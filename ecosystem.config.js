module.exports = {
    apps: [
        {
            name: 'myongoingscalendar-frontend',
            exec_mode: 'cluster',
            instances: 'max',
            cwd: '/opt/app/myongoingscalendar-frontend',
            script: "./node_modules/nuxt/bin/nuxt.js",
            args: "start",
            env: {
                NODE_ENV: 'production'
            },
            env_production: {
                NODE_ENV: 'production'
            },
            ignore_watch: [
                "node_modules"
            ],
            watch: true
        },
        {
            name: "vibrant",
            script: '/opt/app/helpers/vibrant.js',
            ignore_watch: [
                "node_modules"
            ],
            watch: true
        },
        {
            name: "webp",
            script: '/opt/app/helpers/webp.js',
            ignore_watch: [
                "node_modules"
            ],
            watch: true
        }
    ]
};
