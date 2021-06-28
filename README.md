<!-- autogenerated change in README.tmpl.md and README.md of subdirectories -->
# devtools-docker-test-envs

DevTools Team docker images and environments for testing.

**NOTE: Not for production use: the content of this repo is purely for internal testing and is not supported for any other purpose.**

##### Updating this README

This README is generated from the `README.tmpl.md` and all the `README.md` in the subfolders. Call `bash generate-readme.sh` to update it.

### TL;DR

1. Start a testing environment defined in a directory by running:

  ``` sh
  docker-compose -f <directory>/docker-compose.yaml up
  ```

2. Connect using the instructions specific for that [testing environment](#available-setups).

### Docs

<!-- toc -->

- [How to test with the environments in this repo](#how-to-test-with-the-environments-in-this-repo)
  * [Requirements](#requirements)
  * [Usage](#usage)
    + [How to connect to the environments](#how-to-connect-to-the-environments)
- [Troubleshooting](#troubleshooting)
    + [Fresh tear up / down of environments](#fresh-tear-up--down-of-environments)
    + [Rebuilding images](#rebuilding-images)
- [Available setups](#available-setups)
  * [Standalone community server (no auth)](#standalone-community-server-no-auth)
    + [How to connect](#how-to-connect)
  * [Enterprise server](#enterprise-server)
    + [How to connect](#how-to-connect-1)
    + [Enterprise server images](#enterprise-server-images)
      - [How to add new versions](#how-to-add-new-versions)
      - [How to use versions in other environments](#how-to-use-versions-in-other-environments)
  * [Kerberos / GSSAPI](#kerberos--gssapi)
    + [How to connect](#how-to-connect-2)
      - [Kerberos Setup](#kerberos-setup)
      - [Servers](#servers)
      - [Available users](#available-users)
      - [Compass](#compass)
      - [Connection string](#connection-string)
      - [Shell (enterprise)](#shell-enterprise)
  * [LDAP](#ldap)
    + [How to connect](#how-to-connect-3)
  * [ReplicaSet](#replicaset)
    + [Replica set composition](#replica-set-composition)
    + [How to connect](#how-to-connect-4)
      - [Using read preference tags](#using-read-preference-tags)
  * [Username / Password (SCRAM)](#username--password-scram)
    + [How to connect](#how-to-connect-5)
    + [Users](#users)
  * [Sharded cluster](#sharded-cluster)
    + [How to connect](#how-to-connect-6)
  * [SSH Tunnel](#ssh-tunnel)
    + [How to connect](#how-to-connect-7)
      - [SSH tunnel with password](#ssh-tunnel-with-password)
      - [SSH tunnel with identity key (no passphrase)](#ssh-tunnel-with-identity-key-no-passphrase)
      - [SSH tunnel with identity key (with passphrase)](#ssh-tunnel-with-identity-key-with-passphrase)
    + [Regenerating identity keys](#regenerating-identity-keys)
  * [TLS](#tls)
    + [How to connect](#how-to-connect-8)
      - [Unvalidated](#unvalidated)
      - [Server validation](#server-validation)
      - [Server and client validation](#server-and-client-validation)
      - [x509](#x509)
      - [TLS with SSH Tunnel](#tls-with-ssh-tunnel)
    + [Using valid TLS certs](#using-valid-tls-certs)
    + [Regenerating certificates](#regenerating-certificates)

<!-- tocstop -->

## How to test with the environments in this repo

This repository contains a set of Docker images and [docker-compose](https://docs.docker.com/compose/) configurations to start various setup of the server for testing.

### Requirements

In order to start the environments you will need:

- `docker` and `docker-compose`
- access to `/etc/hosts` (required for some of the setups)

`docker` and `docker-compose` are both installed as part of Docker for Desktop: https://www.docker.com/products/docker-desktop.

### Usage

Each setup has its own folder and `docker-compose.yaml` file.

A `docker-compose.yaml` file defines a set of services that will be started as docker containers and how that will happen: from which image, what command, environment variables and files to mount from host, how will be exposed to the network.

To start one setup after a fresh clone is always enough to run `docker-compose up` and start the relative `docker-compose.yaml`.

You can either run `docker-compose up` from the subfolder containing the `docker-compose.yaml` you want to start or just passing the path to a specific `docker-compose.yaml` from the root of the repository.

For example this will start a sharded cluster:

``` sh
docker-compose -f sharded/docker-compose.yaml up
```

**NOTE:** VSCode and other IDEs have extension and support for docker compose, you should be able to start a setup directly from the editor.

Please also refer to the official documentation ([Getting Started](https://docs.docker.com/compose/gettingstarted/), [Cli Reference](https://docs.docker.com/compose/reference/), [YAML Reference](https://docs.docker.com/compose/compose-file/)) and the many other resources online for details on how to use `docker-compose`.

#### How to connect to the environments

Informations on how to connect are available for each setup.

Some of the setups reqiuire entries on the `/etc/hosts` file (or similar in Windows). That is necessary to simulate specific scenarios in the network (for example kerberos realms).

## Troubleshooting

#### Fresh tear up / down of environments

In order to make sure we are actually restarting and using the new
environment for example after changing some of the settings or pulling from main
it can be useful to perform stop and start `docker-compose` in a way that
cleans up old resurces.

This can be done running the following commands:

```
docker-compose down \
  -v \              # also removes volumes
  --remove-orphans  # removes renamed or deleted services
```

```
docker-compose up \
  --remove-orphans # removes renamed or deleted services
  --force-recreate # does not recycle already running containers
```

#### Rebuilding images

Some of the images are built from directories rather than being downloaded from a docker registry.
Normally `docker-compose up` will build all the necessary images automatically and cache them
to avoid re-building all the time.

Passing `--build` will tell `docker-compose` to rebuild images and to pick up changes in the `Dockerfile` of the images.

Sometimes however a `Dockerfile` would use external scripts or files as part of the build, in such case `docker-compose up --build` will not detect any change and we need to force a complete rebuild.

To force a rebuild of an image for a service in `docker-compose` we need to run `docker-compose build --no-cache <service-name>`, for example:

```
docker-compose -f kerberos/docker-compose.yaml build --no-cache mongodb
```

## Available setups

### Standalone community server (no auth)

``` sh
docker-compose -f community/docker-compose.yaml up
```

#### How to connect

``` sh
mongo \
  --host localhost \
  --port 27020
```


### Enterprise server

``` sh
docker-compose -f enterprise/docker-compose.yaml up
```

#### How to connect

``` sh
mongo \
  --host localhost \
  --port 27021
```

#### Enterprise server images

This environment is also used to build enterprise mongodb images and is
referenced by other environments.

The setup for enterprise images follows [the documented one](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-with-docker/) and uses [official images](https://docs.docker.com/docker-hub/official_images/) maintained by docker.

##### How to add new versions

The `add-version.sh` script downloads and setup a new image version. It can be invoked like this:

```
bash enterprise/add-version.sh 4.4
```

**NOTE:** The `VERSION` parameter must correspond to an existing tag in [the docker library](https://github.com/docker-library/official-images/blob/master/library/mongo).

Each `Dockerfile` and `docker-entrypoint.sh` are downloaded in an `enterprise/<VERSION>`
directory for each new version of mongodb.

Additional dependencies for kerberos and LDAP are automatically added in a `RUN` step injected in the downloaded `Dockerfile`.

##### How to use versions in other environments

Enterprise images can be referenced by other testing environments that requires the enterprise server. It can be done pointing the build context to one of the image directory and setting
the right build arguments.

``` yaml
    build:
      image: devtools-mongodb-enterprise:<VERSION>
      context: "../enterprise/<VERSION>"
      args:
        MONGO_PACKAGE: "mongodb-enterprise"
        MONGO_REPO: repo.mongodb.com
```

### Kerberos / GSSAPI

``` sh
docker-compose -f kerberos/docker-compose.yaml up
```

![](/kerberos/overview.jpg)

#### How to connect

##### Kerberos Setup
There are two Kerberos _Key Distribution Centers_ (KDCs) setup: `kdc-admin` and `kdc-admin2`. These two cover the `EXAMPLE.COM` and `EXAMPLE2.COM` realm respectively. All users listed below are registered in the `EXAMPLE.COM` realm. The service principals for `mongodb-kerberos-1` and `mongodb-kerberos-2` are also registered in the `EXAMPLE.COM` realm. The service principal for `mongodb-kerberos-3` is registered in the `EXAMPLE2.COM` realm.

The two Kerberos installations have cross-realm authentication enabled so that `kdc-admin2` (realm `EXAMPLE2.COM`) **trusts** `kdc-admin` (realm `EXAMPLE.COM`). For details on how this cross-realm trust is configured refer to [Setting up Cross-Realm Kerberos Trusts](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system-level_authentication_guide/using_trusts).

Make sure you have this in `/etc/krb5.conf`:

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
```

Authenticate with kdc (the password is `password`):

``` sh
kinit mongodb.user@EXAMPLE.COM
```

##### Servers

All servers are configured with the same set of users.

`mongodb-kerberos-1.example.com` is configured with the default `gssapiServiceName` (`mongodb`), while `mongodb-kerberos-2.example.com` is configured with `gssapiServiceName=alternate`. These two servers are in the Kerberos Realm `EXAMPLE.COM`.

The server `mongodb-kerberos-3.example2.com` has the default `gssapiServiceName` (`mongodb`) but is located in a different Kerberos Realm `EXAMPLE2.COM`.

Make sure you have this line in your `/etc/hosts`:

``` conf
127.0.0.1 mongodb-kerberos-1.example.com mongodb-kerberos-2.example.com mongodb-kerberos-3.example2.com
```


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

### LDAP

``` sh
docker-compose -f ldap/docker-compose.yaml up
```

By default this will use the server in version `4.4`. If you want to use `4.2` you can use the `MONGODB_SERVER` environment variable to override:
```sh
MONGODB_SERVER=4.2 docker-compose -f ldap/docker-compose.yaml up
```

#### How to connect

``` sh
# With enterprise shell:
mongo \
  --host localhost \
  --port 30017 \
  --username 'writer@EXAMPLE.COM' \
  --password 'Password1!' \
  --authenticationMechanism PLAIN \
  --authenticationDatabase '$external'
```

### ReplicaSet

``` sh
docker-compose -f replica-set/docker-compose.yaml up
```

#### Replica set composition

- `mongodb-rs-1`: primary
- `mongodb-rs-2`: secondary
- `mongodb-rs-3`: secondary (`nodeType:ANALYTICS`)

#### How to connect

Add this line to your `/etc/host`:

```
127.0.0.1 mongodb-rs-1 mongodb-rs-2 mongodb-rs-3
```

Connection string:

``` sh
mongo 'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset'
```

##### Using read preference tags

The replica set has a secondary node tagged with `nodeType:ANALYTICS`.

``` sh
mongo 'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset&readPreference=secondary&readPreferenceTags=nodeType:ANALYTICS'
```

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

### Sharded cluster

```
docker-compose -f sharded/docker-compose.yaml up
```

#### How to connect

```
mongo --username root \
  --password password123 \
  --host localhost \
  --authenticationDatabase admin \
  --port 28004
```

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

