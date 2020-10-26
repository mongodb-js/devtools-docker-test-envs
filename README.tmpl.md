# devtools-docker-test-envs

DevTools Team docker images and environments for testing.

**NOTE: Not for production use: the content of this repo is purely for internal testing and is not supported for any other purpose.**

##### Updating this README

This README is generated from the `README.tmpl.md` and all the `README.md` in the subfolders. Call `bash regenerate-readme.sh` to update it.

<!-- toc -->

## Requirements

- `docker` and `docker-compose`
- access to `/etc/hosts` (required for some of the setups)

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
