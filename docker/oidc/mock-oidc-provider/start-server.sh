#!/bin/bash
set -e
OIDC_PROVIDER_PORT=29090
OIDC_PROVIDER_PROXY_PORT=29091
node /tmp/mock-provider/oidc-mock-provider.js $OIDC_PROVIDER_PORT $OIDC_PROVIDER_PROXY_PORT &
node /tmp/mock-provider/proxy.js $OIDC_PROVIDER_PROXY_PORT $OIDC_PROVIDER_PORT &
echo Waiting to make sure that oidc mock provider and proxy are running
until $(curl --output /dev/null --silent --head --fail http://localhost:$OIDC_PROVIDER_PROXY_PORT/.well-known/openid-configuration); do
    sleep 0.3
done
echo Starting server
OIDC_IDENTITY_PROVIDERS="[$(curl --fail http://localhost:29091/server-oidc-config)]"
# This is original mongodb/mongodb-enterprise-server entrypoint
python3 /usr/local/bin/docker-entrypoint.py \
    --setParameter authenticationMechanisms="SCRAM-SHA-256,MONGODB-OIDC" \
    --setParameter enableTestCommands="true" \
    --setParameter oidcIdentityProviders="$OIDC_IDENTITY_PROVIDERS"
