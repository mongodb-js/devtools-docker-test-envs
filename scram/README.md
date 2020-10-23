### Username / Password (SCRAM)

```
docker-compose -f scram/docker-compose.yaml up
```

#### How to connect

```
mongo \
  --username <see list below>
  --password password
  --host localhost \
  --port 28006 \
  [--authenticationMechanism=SCRAM-SHA-1|SCRAM-SHA-256] \
  --authenticationDatabase admin|dbAuth
```

#### Users

- `user1`: readWriteAnyDatabase with both `SCRAM-SHA-1` and `SCRAM-SHA-256`.
- `scramSha1`: readWriteAnyDatabase with only `SCRAM-SHA-1`.
- `scramSha256`: readWriteAnyDatabase with only `SCRAM-SHA-256`.
- `user2`: user with specific privileges on non-existing / empty databases.
- `customRole`: custom role with privileges on non-existing collections.
- `authDb`: user with a different authentication database (`authDb`).

See `scram/initdb/init.js` for details.
