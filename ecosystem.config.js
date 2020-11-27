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
        },
        {
            name: "vibrant",
            script: '/opt/app/helpers/vibrant.js',
        },
        {
            name: "webp",
            script: '/opt/app/helpers/webp.js',
        }
    ]
};
