### MongoDB enterprise with mock OIDC provider auth enabled

```sh
docker-compose -f oidc/mock-oidc-provider/docker-compose.yaml up
```

#### How to connect

```sh
mongosh \
  --host localhost \
  --port 27017 \
  --authenticationMechanism MONGODB-OIDC
```

Connection string:

```
mongodb://localhost:27017/?authMechanism=MONGODB-OIDC
```
