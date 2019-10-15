module.exports = {
    apps: [
        {
            name: 'CQPF',
            script: 'index.js',
            instances: 1,
            autorestart: true,
            max_restarts: 5,
            watch: ['config.json'],
            out_file: './logs/normal.log',
            error_file: './logs/error.log',
        },
    ],
};
