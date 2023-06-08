#!/bin/bash

docker-compose -f docker/enterprise/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/ldap/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/oidc/identity-provider-mock/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/scram/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/sharded/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/ssh/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/tls/docker-compose.yaml down --remove-orphans --volumes
docker-compose -f docker/kerberos/docker-compose.yaml down --remove-orphans --volumes
