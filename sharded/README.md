### Sharded cluster

```
docker-compose -f sharded/docker-compose.yaml up
```

#### How to connect

```
mongo --username root \
  --password password123 \
  --host localhost \
  --authenticationDatabase admin \
  --port 28004
```
