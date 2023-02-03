const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/chat',
        createProxyMiddleware({
            // 👇️ make sure to update your target
            target: 'http://127.0.0.1:5001',
            headers: {
                "Connection": "keep-alive"
            },
            changeOrigin: true,
        }),
    );
};