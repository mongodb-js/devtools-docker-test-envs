### OIDC with mock provider

Uses the mock OIDC provider from the [oidc-mock-provider](https://github.com/mongodb-js/devtools-shared/tree/main/packages/oidc-mock-provider) package.

The mock OIDC provider server runs on port 28200.

#### Startup

```sh
docker-compose -f oidc/identity-provider-mock/docker-compose.yaml up
```

#### How to connect

```sh
mongosh \
  --host localhost \
  --port 27096 \
  --authenticationMechanism MONGODB-OIDC
```

Connection string:

```
mongodb://localhost:27096/?authMechanism=MONGODB-OIDC
```
