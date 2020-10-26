
### Standalone community server (no auth)

``` sh
docker-compose -f community/docker-compose.yaml up
```

#### How to connect

``` sh
mongo \
  --host localhost \
  --port 27020
```
