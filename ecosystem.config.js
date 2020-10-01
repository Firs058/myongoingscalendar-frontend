module.exports = {
    apps: [
        {
            name: 'MyOngoingsCalendar',
            instances: 'max',
            cwd: './dist',
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
    ],

    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
