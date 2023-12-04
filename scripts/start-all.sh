#!/bin/bash

docker-compose -f docker/enterprise/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/ldap/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/scram/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/sharded/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/ssh/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/tls/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/kerberos/docker-compose.yaml up -d --force-recreate
docker-compose -f docker/oidc/mock-oidc-provider/docker-compose.yaml up -d --force-recreate
