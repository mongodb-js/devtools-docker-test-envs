<!-- autogenerated change in README.tmpl.md and README.md of subdirectories -->
# devtools-docker-test-envs

DevTools Team docker images and environments for testing.

**NOTE: Not for production use: the content of this repo is purely for internal testing and is not supported for any other purpose.**

### TL;DR

Run

```
docker-compose -f <directory>/docker-compose.yaml
```

to start the testing environment in that folder.

ie.

```
docker-compose -f replica-set/docker-compose.yaml
```

##### Updating this README

This README is generated from the `README.tmpl.md` and all the `README.md` in the subfolders. Call `bash generate-readme.sh` to update it.

<!-- toc -->

- [How to test with the environments in this repo](#how-to-test-with-the-environments-in-this-repo)
  * [Requirements](#requirements)
  * [Usage](#usage)
    + [How to connect to the environments](#how-to-connect-to-the-environments)
- [Troubleshooting](#troubleshooting)
    + [Fresh tear up / down of environments](#fresh-tear-up--down-of-environments)
    + [Rebuilding images](#rebuilding-images)
- [Available setups](#available-setups)
  * [Standalone without authentication](#standalone-without-authentication)
    + [How to connect](#how-to-connect)
  * [Enterprise server](#enterprise-server)
    + [How to connect](#how-to-connect-1)
    + [Enterprise server images](#enterprise-server-images)
      - [How to add new versions](#how-to-add-new-versions)
      - [How to use versions in other environments](#how-to-use-versions-in-other-environments)
  * [Kerberos / GSSAPI](#kerberos--gssapi)
    + [How to connect](#how-to-connect-2)
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
    + [Regenerating certificates](#regenerating-certificates)

<!-- tocstop -->

## How to test with the environments in this repo

This repository contains a set of `docker` images and [docker-compose](https://docs.docker.com/compose/) configurations to start various setup of the server for testing.

### Requirements

In order to start the environments you will need:

- `docker` and `docker-compose`
- access to `/etc/hosts` (required for some of the setups)

`docker` and `docker-compose` are both installed as part of Docker for Desktop: https://www.docker.com/products/docker-desktop.

### Usage

Each setup has its own folder and `docker-compose.yaml` file.

A `docker-compose.yaml` file describe a set of services that has to be started as docker containers and how that will happen: from which image, what command, environment variables and files to mount from host, how it will be exposed to the network.

To start one setup after a fresh clone is always enough to run `docker-compose up` and start the relative `docker-compose.yaml`.

You can either run `docker-compose up` from the subfolder containing the `docker-compose.yaml` you want to start or just passing the path to a specific `docker-compose.yaml` from the root of the repository.

For example this will start a sharded cluster:

``` sh
docker-compose -f sharded/docker-compose.yaml
```

**NOTE:** VSCode and other IDEs have extension and support for docker compose, you should be able to start a setup directly from the editor.

Please also refer to the official documentation ([Getting Started](https://docs.docker.com/compose/gettingstarted/), [Cli Reference](https://docs.docker.com/compose/reference/), [YAML Reference](https://docs.docker.com/compose/compose-file/)) and the many other resources online for details on how to use `docker-compose`.

#### How to connect to the environments

Informations on how to connect are available for each setup.

Some of the setups reqiuires entries on the `/etc/hosts` file (or similar in Windows). That is to simulate specific scenarios with the network (for example kerberos realms).

## Troubleshooting

#### Fresh tear up / down of environments

In order to make sure we are actually restarting and using the new
environment for example after changing some settings or pulling from main
is can be useful to perform stop and start `docker-compose` in a way that
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

### Standalone without authentication

``` sh
docker-compose -f basic/docker-compose.yaml up
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
  --port 27020
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
# with enterprise shell:
mongo \
  --host mongodb-enterprise.EXAMPLE.COM \
  --port 29017 \
  --authenticationDatabase '$external' \
  --authenticationMechanism GSSAPI \
  -u mongodb.user@EXAMPLE.COM
```

### LDAP

``` sh
docker-compose -f ldap/docker-compose.yaml up
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
SSH Tunnel: Use Password
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
SSH Tunnel: Use Password
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
mongodb://localhost:27030
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

#### Regenerating certificates

Run `bash ./recreate-pem.sh` to re-generate the certificates if needed.

