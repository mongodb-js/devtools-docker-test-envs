### TLS

```
docker-compose -f tls/docker-compose.yaml up
```

#### How to connect

Note when connecting with the shell `--sslAllowInvalidCertificates`
will be required:

```
mongo --host localhost --port 27030 \
  --ssl --sslCAFile tls/ca.pem --sslPEMKeyFile tls/client.pem \
  --sslAllowInvalidCertificates
```

##### Unvalidated

Use these parameters to connect with unvalidated:

```
mongodb://localhost:27029
```

##### Server validation

Use these parameters to connect with server validation:

```
mongodb://localhost:27029
tlsCAFile=tls/ca.pem
```

##### Server and client validation

Use these parameters to connect with both client and server validation:

```
mongodb://localhost:27030
tlsCertificateKeyFile=tls/client.pem
tlsCAFile=tls/ca.pem
```

##### x509

Use these parameters to connect with x509:

```
mongodb://localhost:27031
tlsCertificateKeyFile=tls/client.pem
tlsCAFile=tls/ca.pem
```

##### TLS with SSH Tunnel

Is possible to test TLS over an ssh connection by using a jumphost started on port `22223` and the service name and target port configured in `docker-compse.yaml` as host and port. For example:

```
Hostname: mongodb-tls-x509
Port: 27017
---
tlsCertificateKeyFile=tls/client.pem
tlsCAFile=tls/ca.pem
---
SSH Tunnel: Use Password
SSH Hostname: localhost
SSH Tunnel Port: 22223
SSH Username: root
SSH Password: password
```

See [SSH Tunnel](#ssh-tunnel) for instructions on connecting with SSH Tunnels.

#### Using valid TLS certs

This setup uses self-signed certificates that can be committed in this repo.

If necessary valid certificates can be obtained from `https://x509gen.corp.mongodb.com`.

The `ca.pem`, `server.pem` and `client.pem` downloaded can be used as replacement for those in the `tls` folder.

Please do not commit those certificates back in the repo.

#### Regenerating certificates

Run `bash ./recreate-pem.sh` to re-generate the certificates if needed.
