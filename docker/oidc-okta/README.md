### OIDC with Okta

**This setup is intentionally not included in testing fixtures as it requires user set environment variables**

This runs a mongodb server that uses Okta as the identity provider for the OIDC authentication mechanism.

First setup okta and create credentials by follow the setup here: https://github.com/mongodb-js/oidc-plugin/blob/main/test/okta-setup.md
This image relies on two environment variables being set:
`OKTA_CLIENT_ID` — This is the client id of our application in okta. Something like `0ob3qg2zmpoL6sjf93e9`
`OKTA_ISSUER` — This is the identity provider issuer which provides the access tokens. Something like `https://dev-1234567890.okta.com/oauth2/abcDEF1234567890`
When the image is built those variables are used for the `oidcIdentityProviders` configuration.

```sh
docker-compose -f oidc-okta/docker-compose.yaml up
```

#### How to connect

```sh
mongosh \
  --host localhost \
  --port 27095 \
  --authenticationMechanism MONGODB-OIDC
```

Connection string:

```
mongodb://localhost:27095/?authMechanism=MONGODB-OIDC
```
