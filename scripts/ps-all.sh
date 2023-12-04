#!/bin/bash

docker-compose -f docker/enterprise/docker-compose.yaml ps
docker-compose -f docker/ldap/docker-compose.yaml ps
docker-compose -f docker/scram/docker-compose.yaml ps
docker-compose -f docker/sharded/docker-compose.yaml ps
docker-compose -f docker/ssh/docker-compose.yaml ps
docker-compose -f docker/tls/docker-compose.yaml ps
docker-compose -f docker/kerberos/docker-compose.yaml ps
docker-compose -f docker/oidc/mock-oidc-provider/docker-compose.yaml ps
