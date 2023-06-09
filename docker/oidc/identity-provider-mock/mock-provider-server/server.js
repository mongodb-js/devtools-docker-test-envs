'use strict';

const { OIDCMockProvider } = require('@mongodb-js/oidc-mock-provider');

const port = 28200;

const DEFAULT_TOKEN_PAYLOAD = {
  expires_in: 3600,
  payload: {
    // Define the user information stored inside the access tokens.
    groups: ['testgroup'],
    sub: 'testuser',
    aud: 'resource-server-audience-value',
  },
};

async function run() {
  const oidcMockProviderConfig = {
    getTokenPayload() {
      return DEFAULT_TOKEN_PAYLOAD;
    },
    overrideRequestHandler() {
      return () => {};
    },
    port
  };
  await OIDCMockProvider.create(oidcMockProviderConfig);

  console.log(`Started OIDC mock identity provider server. Listening on port ${port}.`);
}

run();
