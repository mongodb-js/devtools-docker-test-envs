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
MDB_PID="$!"

# Wait for the mongodb server to start.
# sleep 5
until nc -z localhost 27017; do
    sleep 1
done

# Creates the OIDC user role in the database.
mongosh "mongodb://localhost:27017/admin" --eval "JSON.stringify(db.createRole({ role: \"dev/groups\", privileges: [ ], roles: [ \"dbOwner\" ] }));"

# Stop the no auth database (we re-start it with auth enabled next).
echo Stopping no-auth server pid $MDB_PID
kill $MDB_PID

pkill mongod

# Wait for the mongodb server to shut down.
# sleep 15
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
