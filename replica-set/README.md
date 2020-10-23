### ReplicaSet

```
docker-compose -f replica-set/docker-compose.yaml up
```

#### How to connect

Add this line to your `/etc/host`:

```
127.0.0.1 mongodb-rs-1 mongodb-rs-2 mongodb-rs-3
```

Connection string:

```
mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset
```
