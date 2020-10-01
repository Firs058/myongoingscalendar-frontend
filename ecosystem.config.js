module.exports = {
    apps: [
        {
            name: 'myongoingscalendar-frontend',
            exec_mode: 'cluster',
            instances: 'max',
            cwd: './.nuxt',
            script: "./node_modules/nuxt/bin/nuxt.js",
            args: "start",
        },
        {
            name: "vibrant",
            script: 'vibrant.js',
            ignore_watch: [
                "node_modules"
            ],
            watch: [
                "server",
                "client"
            ],
            watch_options: {
                followSymlinks: false
            }
        },
        {
            name: "webp",
            script: 'webp.js',
            ignore_watch: [
                "node_modules"
            ],
            watch: [
                "server",
                "client"
            ],
            watch_options: {
                followSymlinks: false
            }
        }
    ]
};
