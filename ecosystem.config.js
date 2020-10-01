module.exports = {
    apps: [
        {
            name: 'myongoingscalendar-frontend',
            exec_mode : 'cluster',
            instances: 'max',
            script: "/usr/local/lib/node_modules/nuxt/bin/nuxt.js",
            args: "start",
        },
        {
            name: "vibrant",
            script: 'vibrant.js',
            ignore_watch: [
                "node_modules",
                "images"
            ],
            watch_options: {
                followSymlinks: false
            }
        },
        {
            name: "webp",
            script: 'webp.js',
            ignore_watch: [
                "node_modules",
                "images"
            ],
            watch_options: {
                followSymlinks: false
            }
        }
    ]
};
