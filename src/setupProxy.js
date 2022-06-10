const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/local',
        createProxyMiddleware({
            target: process.env.REACT_APP_INTERFACE_URL,
            changeOrigin: true,
            pathRewrite: {
                '^/local': ''
            }
        })
    );
};