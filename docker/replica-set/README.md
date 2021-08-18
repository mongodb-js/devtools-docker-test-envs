### ReplicaSet

``` sh
docker-compose -f replica-set/docker-compose.yaml up
```

#### Replica set composition

- `mongodb-rs-1`: primary
- `mongodb-rs-2`: secondary
- `mongodb-rs-3`: secondary (`nodeType:ANALYTICS`)

#### How to connect

Add this line to your `/etc/host`:

```
127.0.0.1 mongodb-rs-1 mongodb-rs-2 mongodb-rs-3
```

Connection string:

``` sh
mongo 'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset'
```

##### Using read preference tags

The replica set has a secondary node tagged with `nodeType:ANALYTICS`.

``` sh
mongo 'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset&readPreference=secondary&readPreferenceTags=nodeType:ANALYTICS'
```

#### Direct connection to a private RS node

``` sh
mongo 'mongodb://root:password123@localhost:28004/db1?authSource=admin'
```
