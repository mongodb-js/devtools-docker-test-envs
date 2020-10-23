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
mongodb://localhost:27030
tlsCertificateKeyFile=tls/client.pem
tlsCAFile=tls/ca.pem
```

#### Regenerating certificates

Run `bash ./recreate-pem.sh` to re-generate the certificates if needed.
