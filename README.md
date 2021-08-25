# devtools-docker-test-envs

DevTools Team docker images and environments for testing.

## Notes

 * **Not for production use:** the content of this repo is purely for internal testing and is not supported for any other purpose.
 * Some of the test environments provided in this repository use MongoDB Enterprise Server. MongoDB Enterprise Server is licensed under [the MongoDB Customer Agreement](https://www.mongodb.com/customer-agreement). Except for evaluation purposes, you may not use MongoDB Enterprise Server without a commercial license from MongoDB.


##### Updating this README

This README is generated from the `README.tmpl.md` and all the `README.md` in the subfolders. Call `bash generate-readme.sh` to update it.

### TL;DR

1. Start a testing environment defined in a directory by running:

```sh
docker-compose -f docker/<directory>/docker-compose.yaml up
```

2. Connect using the instructions specific for that testing environment as specified in the readme of each folder

### Docs

## How to test with the environments in this repo

This repository contains a set of Docker images and [docker-compose](https://docs.docker.com/compose/) configurations to start various setup of the server for testing.

### Requirements

In order to start the environments you will need:

- `docker` and `docker-compose`
- access to `/etc/hosts` (required for some of the setups)

`docker` and `docker-compose` are both installed as part of Docker for Desktop: https://www.docker.com/products/docker-desktop.

### Usage

#### With docker-compose

Each setup has its own folder and `docker-compose.yaml` file.

A `docker-compose.yaml` file defines a set of services that will be started as docker containers and how that will happen: from which image, what command, environment variables and files to mount from host, how will be exposed to the network.

To start one setup after a fresh clone is always enough to run `docker-compose up` and start the relative `docker-compose.yaml`.

You can either run `docker-compose up` from the subfolder containing the `docker-compose.yaml` you want to start or just passing the path to a specific `docker-compose.yaml` from the root of the repository.

For example this will start a sharded cluster:

```sh
docker-compose -f sharded/docker-compose.yaml up
```

**NOTE:** VSCode and other IDEs have extension and support for docker compose, you should be able to start a setup directly from the editor.

Please also refer to the official documentation ([Getting Started](https://docs.docker.com/compose/gettingstarted/), [Cli Reference](https://docs.docker.com/compose/reference/), [YAML Reference](https://docs.docker.com/compose/compose-file/)) and the many other resources online for details on how to use `docker-compose`.

#### Programmatically

```js
const createTestEnvironments = require('@mongodb-js/devtools-docker-test-envs');

const testEnvironments = createTestEnvironments(['...', 'sharded', '...']);

before(async () => {
  await testEnvironments.start();
});

it('can connect to sharded cluster', () => {
  const { connectionString } = testEnvironments.getConnectionOptions('sharded');
  await MongoClient.connect(connectionString);
});

after(async () => {
  await testEnvironments.stop();
});
```

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
