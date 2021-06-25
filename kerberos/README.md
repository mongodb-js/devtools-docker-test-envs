### Kerberos / GSSAPI

![](/kerberos/overview.jpg)

Make sure you have this line in your `/etc/hosts`:

``` conf
127.0.0.1 mongodb-kerberos-1.example.com mongodb-kerberos-2.example.com mongodb-kerberos-3.examplewrong.com
```

Make sure you have this in `/etc/krb5.conf` (note the `domain_realm` section to configure cross-realm):

``` conf
[realms]
        EXAMPLE.COM = {
                kdc = localhost
                admin_server = localhost
        }

        EXAMPLE2.COM = {
                kdc = localhost:89
                admin_server = localhost:849
        }

[domain_realm]
        .examplewrong.com = EXAMPLE2.COM
```

Start the docker environment:

``` sh
docker-compose -f kerberos/docker-compose.yaml up
```

Authenticate with kdc (the password is `password`):

``` sh
kinit mongodb.user@EXAMPLE.COM
```

**Important:** To stop the environment, make sure to use the `-v` flag:

``` sh
docker-compose -f kerberos/docker-compose.yaml down -v
```


#### How to connect

##### Kerberos Setup
There are two Kerberos _Key Distribution Centers_ (KDCs) setup: `kdc-admin` and `kdc-admin2`. These two cover the `EXAMPLE.COM` and `EXAMPLE2.COM` realm respectively. All users listed below are registered in the `EXAMPLE.COM` realm. The service principals for `mongodb-kerberos-1` and `mongodb-kerberos-2` are also registered in the `EXAMPLE.COM` realm. The service principal for `mongodb-kerberos-3` is registered in the `EXAMPLE2.COM` realm.

The two Kerberos installations have cross-realm authentication enabled so that `kdc-admin2` (realm `EXAMPLE2.COM`) **trusts** `kdc-admin` (realm `EXAMPLE.COM`). For details on how this cross-realm trust is configured refer to [Setting up Cross-Realm Kerberos Trusts](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system-level_authentication_guide/using_trusts).

##### Servers

All servers are configured with the same set of users.

`mongodb-kerberos-1.example.com` is configured with the default `gssapiServiceName` (`mongodb`), while `mongodb-kerberos-2.example.com` is configured with `gssapiServiceName=alternate`. These two servers are in the Kerberos Realm `EXAMPLE.COM`.

The server `mongodb-kerberos-3.examplewrong.com` has the default `gssapiServiceName` (`mongodb`) but is located in a different Kerberos Realm `EXAMPLE2.COM`.

##### Available users

- `mongodb.user@EXAMPLE.COM`
- `encoded!user@EXAMPLE.COM`
- `application/reporting@EXAMPLE.COM`

##### Compass

``` yaml
hostname: mongodb-kerberos-1.example.com
port: 29017
principal: mongodb.user@EXAMPLE.COM
gssapiServiceName: mongodb
```

##### Connection string

With as few properties as possible (`gssapiServiceName`, `authSource` will be inferred automatically) - does not work in the _old shell_:
``` sh
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-kerberos-1.example.com:29017/?authMechanism=GSSAPI
```

With `authSource` for the old shell:
``` sh
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-kerberos-1.example.com:29017/?authMechanism=GSSAPI&authSource=%24external
```

With an alternate service name using official `SERVICE_NAME` auth  - does not work in the _old shell_:
``` sh
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-kerberos-2.example.com:29018/?authMechanism=GSSAPI&authMechanismProperties=SERVICE_NAME:alternate
```

With an alternate service name for the old shell:
``` sh
mongodb://mongodb.user%40EXAMPLE.COM@mongodb-kerberos-2.example.com:29018/?gssapiServiceName=alternate&authMechanism=GSSAPI&authSource=%24external
```

##### Shell (enterprise)

``` sh
mongo \
  --host mongodb-kerberos-1.example.com \
  --port 29017 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  -u mongodb.user@EXAMPLE.COM
```

``` sh
mongo \
  --host mongodb-kerberos-2.example.com \
  --port 29018 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  --gssapiServiceName alternate \
  -u mongodb.user@EXAMPLE.COM
```
