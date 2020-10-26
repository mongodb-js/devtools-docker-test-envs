
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
