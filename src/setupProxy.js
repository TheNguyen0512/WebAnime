const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/login',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    '/register',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    '/check-mail',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    '/profile',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    '/upcoming-anime',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

module.exports = function (app) {
  app.use(
    '/ani-genre',
    createProxyMiddleware({
      target: 'http://localhost:3030',
      changeOrigin: true,
    })
  );
};

