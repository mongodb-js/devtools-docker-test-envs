### LDAP

```sh
docker-compose -f ldap/docker-compose.yaml up
```

By default this will use the server in version `4.4`. If you want to use `4.2` you can use the `MONGODB_SERVER` environment variable to override:

```sh
MONGODB_SERVER=4.2 docker-compose -f ldap/docker-compose.yaml up
```

#### How to connect

```sh
# With enterprise shell:
mongo \
  --host localhost \
  --port 30017 \
  --username 'writer@EXAMPLE.COM' \
  --password 'Password1!' \
  --authenticationMechanism PLAIN \
  --authenticationDatabase '$external'
```
