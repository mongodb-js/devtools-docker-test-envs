### Kerberos / GSSAPI

``` sh
docker-compose -f kerberos/docker-compose.yaml up
```

#### How to connect

Make sure you have this in `/etc/krb5.conf`:

``` conf
[libdefaults]
        default_realm = EXAMPLE.COM
        dns_canonicalize_hostname = false

[realms]
        EXAMPLE.COM = {
                kdc = localhost
                admin_server = localhost
        }
```

Make sure you have this line in your `/etc/hosts`:

``` conf
127.0.0.1 mongodb-enterprise.example.com
```

Authenticate with kdc (the password is `password`):

``` sh
kinit mongodb.user@EXAMPLE.COM
```

##### Available users

- `mongodb.user@EXAMPLE.COM`
- `encoded!user@EXAMPLE.COM`
- `application/reporting@EXAMPLE.COM`

##### Compass

``` yaml
hostname: mongodb-enterprise.example.com
port: 29017
principal: mongodb.user@EXAMPLE.COM
gssapiServiceName: mongodb
```

##### Connection string

``` sh
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-enterprise.example.com:29017/?gssapiServiceName=mongodb&authMechanism=GSSAPI&authSource=%24external
```

##### Shell (enterprise)

``` sh
mongo \
  --host mongodb-enterprise.EXAMPLE.COM \
  --port 29017 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  -u mongodb.user@EXAMPLE.COM
```
