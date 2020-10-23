### Kerberos / GSSAPI

```
docker-compose -f kerberos/docker-compose.yaml up
```

#### How to connect

Make sure you have this line in your `/etc/hosts`.

```
127.0.0.1 mongodb-enterprise.example.com
```

Authenticate with kdc (the password is `password`):

```
kinit --kdc-hostname=localhost mongodb.user@EXAMPLE.COM
```

```
# with enterprise shell:
mongo \
  --host mongodb-enterprise.EXAMPLE.COM \
  --port 29017 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  -u mongodb.user@EXAMPLE.COM
```
