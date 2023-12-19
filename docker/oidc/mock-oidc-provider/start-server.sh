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

echo Setting up user roles
# Start the server (without auth).
# This is original mongodb/mongodb-enterprise-server entrypoint
python3 /usr/local/bin/docker-entrypoint.py \
    --setParameter authenticationMechanisms="MONGODB-OIDC" \
    --setParameter enableTestCommands="true" \
    --setParameter oidcIdentityProviders="$OIDC_IDENTITY_PROVIDERS" > /dev/null &

# Wait for the mongodb server to start.
until nc -z localhost 27017; do
    sleep 1
done
# Creates the OIDC user role in the database.
mongosh "mongodb://localhost:27017/admin" --json --eval "(process.env.OIDC_TOKEN_PAYLOAD_GROUPS ?? 'testgroup').split(',').map(group => db.createRole({ role: 'dev/' + group, privileges: [ ], roles: [ \"readWriteAnyDatabase\" ] }));"

# Stop the no auth database (we re-start it with auth enabled next).
pkill mongod

# Wait for the mongodb server to shut down.
until ! nc -z localhost 27017; do
    sleep 1
done

echo Starting server
OIDC_IDENTITY_PROVIDERS="[$(curl --fail http://localhost:29091/server-oidc-config)]"
# This is original mongodb/mongodb-enterprise-server entrypoint
python3 /usr/local/bin/docker-entrypoint.py \
    --setParameter authenticationMechanisms="MONGODB-OIDC" \
    --setParameter enableTestCommands="true" \
    --auth \
    --setParameter oidcIdentityProviders="$OIDC_IDENTITY_PROVIDERS"
