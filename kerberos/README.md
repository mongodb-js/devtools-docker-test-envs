### Kerberos / GSSAPI

``` sh
docker-compose -f kerberos/docker-compose.yaml up
```

#### How to connect

Make sure you have this line in your `/etc/hosts`.

```
127.0.0.1 mongodb-enterprise.example.com
```

Authenticate with kdc (the password is `password`):

``` sh
kinit --kdc-hostname=localhost mongodb.user@EXAMPLE.COM
```

``` sh
# Connection string
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-enterprise.example.com:29017/?gssapiServiceName=mongodb&authMechanism=GSSAPI&readPreference=primary&authSource=%24external&appname=MongoDB%20Compass%20Beta&ssl=false&authSource=$external
```

``` sh
# with enterprise shell:
mongo \
  --host mongodb-enterprise.EXAMPLE.COM \
  --port 29017 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  -u mongodb.user@EXAMPLE.COM
```
