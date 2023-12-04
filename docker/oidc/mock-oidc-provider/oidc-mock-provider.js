const { OIDCMockProvider } = require('@mongodb-js/oidc-mock-provider');

const DEFAULT_TOKEN_PAYLOAD = {
  expires_in: process.env.OIDC_TOKEN_PAYLOAD_EXPIRES_IN
    ? Number(process.env.OIDC_TOKEN_PAYLOAD_EXPIRES_IN)
    : 3600,
  payload: {
    // Define the user information stored inside the access tokens.
    groups: process.env.OIDC_TOKEN_PAYLOAD_GROUPS
      ? process.env.OIDC_TOKEN_PAYLOAD_GROUPS.split(',')
      : ['testgroup'],
    sub: process.env.OIDC_TOKEN_PAYLOAD_SUB || 'testuser',
    aud: process.env.OIDC_TOKEN_PAYLOAD_AUD || 'resource-server-audience-value',
  },
};

(async () => {
  const port = process.argv[2];
  const proxyPort = process.argv[3];
  const serverOidcConfig = {
    get issuer() {
      return provider.issuer;
    },
    clientId: 'testServer',
    requestScopes: ['mongodbGroups'],
    authorizationClaim: 'groups',
    audience: 'resource-server-audience-value',
    authNamePrefix: 'dev',
  };
  const provider = await OIDCMockProvider.create({
    port: Number(port),
    getTokenPayload() {
      return DEFAULT_TOKEN_PAYLOAD;
    },
    overrideRequestHandler(_url, req, res) {
      console.log('[OIDC PROVIDER] %s %s', req.method, req.url);
      if (req.url === '/server-oidc-config') {
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(serverOidcConfig));
        res.end();
      }
    },
  });
  console.log('[OIDC PROVIDER] Listening on %s', provider.issuer);
  // To make sure oidc-mock-provider can be used by the server, we need to make
  // sure that it's listening on the localhost and the issuer returned by the
  // various mock provider requests is matching for all parts of the OIDC flow.
  //
  // This is tricky in docker environment on macos where we can't run the
  // container attached to the host network. We can't use docker hostnames
  // either because then we will not be passing various http localhost checks in
  // server or oidc-plugin.
  //
  // To work around that we set up a proxy (see `./proxy.js`) that actually
  // listens on all interfaces (0.0.0.0), while mock provider is only listening
  // to localhost. To make sure that all responses returned by mock provider are
  // matching the proxy address that is exposed outside, we override instance
  // issuer property after we start the mock provider.
  provider.issuer = `http://localhost:${proxyPort}`;
})();
