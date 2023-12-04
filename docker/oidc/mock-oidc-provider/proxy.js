// see ./oidc-mock-provider.js for why we need this proxy
const http = require('http');

const from = process.argv[2];
const to = process.argv[3];

http
  .createServer(function (clientReq, clientRes) {
    console.log('[OIDC PROVIDER PROXY] %s %s', clientReq.method, clientReq.url);

    const options = {
      hostname: 'localhost',
      port: to,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    };

    const proxy = http.request(options, function (res) {
      clientRes.writeHead(res.statusCode, res.headers);
      res.pipe(clientRes, { end: true });
    });

    clientReq.pipe(proxy, { end: true });
  })
  .listen(from, '0.0.0.0', () => {
    console.log(`[OIDC PROVIDER PROXY] Listening on http://0.0.0.0:${from}`);
  });
