### SSH Tunnel

```
docker-compose -f ssh/docker-compose.yaml up
```

#### How to connect

##### SSH tunnel with password

```
Hostname: mongo
Port: 27017
SSH Tunnel: Use Password
SSH Hostname: localhost
SSH Tunnel Port: 22222
SSH Username: root
SSH Password: password
```

##### SSH tunnel with identity key (no passphrase)

```
Hostname: mongo
Port: 27017
SSH Tunnel: Use Identity File
SSH Hostname: localhost
SSH Tunnel Port: 22222
SSH Username: root
SSH Identity File: "keys/key-without-passphrase"
SSH Passphrase: ""
```

##### SSH tunnel with identity key (with passphrase)

```
Hostname: mongo
Port: 27017
SSH Tunnel: Use Identity File
SSH Hostname: localhost
SSH Tunnel Port: 22222
SSH Username: root
SSH Identity File: "keys/key-with-passphrase"
SSH Passphrase: "passphrase"
```

#### Regenerating identity keys

Run `bash ./recreate-keys.sh` to re-generate the identity keys if needed.
