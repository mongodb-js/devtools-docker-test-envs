### Username / Password (SCRAM)

```
docker-compose -f scram/docker-compose.yaml up
```

#### How to connect

```
mongo \
  --username <see list below>
  --password <see list below>
  --host localhost \
  --port 28006 \
  [--authenticationMechanism=SCRAM-SHA-1|SCRAM-SHA-256] \
  --authenticationDatabase admin|dbAuth
```

#### Users

- `user1:password`: readWriteAnyDatabase with both `SCRAM-SHA-1` and `SCRAM-SHA-256`.
- `randomPassword:C;Ib86n5b8{AnExew[TU%XZy,)E6G!dk`: readWriteAnyDatabase with both `SCRAM-SHA-1` and `SCRAM-SHA-256`, this user has a password that requires encoding.
- `scramSha1:password`: readWriteAnyDatabase with only `SCRAM-SHA-1`.
- `scramSha256:password`: readWriteAnyDatabase with only `SCRAM-SHA-256`.
- `user2:password`: user with specific privileges on non-existing / empty databases.
- `customRole:password`: custom role with privileges on non-existing collections.
- `authDb:password`: user with a different authentication database (`authDb`).

See `scram/initdb/init.js` for details.
