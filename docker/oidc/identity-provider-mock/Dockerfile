FROM ubuntu:20.04

ARG TARGETARCH

ENV BUILT_MONGODB_VERSION=${MONGODB_VERSION}

RUN apt-get update -y && apt-get install -y \
  curl libcurl4 libgssapi-krb5-2 libldap-2.4-2 libwrap0 \
  libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit \
  snmp openssl liblzma5 jq

# 1. Copy over the the identity provider server script (started later).
# Logs are output to mock-identity-provider-server.log
COPY install-and-start-mock-identity-provider-server.sh /install-and-start-mock-identity-provider-server.sh

# 2. Download and setup the mongodb server with OIDC auth.
COPY install-server.sh /install-server.sh
RUN bash install-server.sh
COPY etc/mongod.conf /etc/mongod.conf
RUN mkdir /db

# 3. Start the mongodb server and the mock identity provider server,
# use the identity provider server as the issuer.
# We don't use a seperate docker container for the provider as
# the connection must be https:// if it's not `localhost`.
CMD bash ./install-and-start-mock-identity-provider-server.sh \
  && mongodb/bin/mongod --config /etc/mongod.conf \
    --setParameter oidcIdentityProviders="[{'clientId':'testServer','issuer':'http://localhost:28200','requestScopes':['mongodbGroups'],'authorizationClaim':'groups','audience':'resource-server-audience-value','authNamePrefix':'dev'}]" \
