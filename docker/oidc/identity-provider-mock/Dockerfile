FROM ubuntu:20.04
EXPOSE 27017

ARG TARGETARCH

ENV BUILT_MONGODB_VERSION=${MONGODB_VERSION}

RUN apt-get update -y && apt-get install -y \
  curl libcurl4 libgssapi-krb5-2 libldap-2.4-2 libwrap0 \
  libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit \
  snmp openssl liblzma5 jq

COPY install-server.sh /install-server.sh
RUN bash install-server.sh
COPY etc/mongod.conf /etc/mongod.conf

RUN mkdir /db

CMD mongodb/bin/mongod --config /etc/mongod.conf \
  --setParameter enableTestCommands=true \
  --setParameter oidcIdentityProviders="[{'clientId':'testServer','issuer':'http://localhost:28200','requestScopes':['mongodbGroups'],'authorizationClaim':'groups','audience':'resource-server-audience-value','authNamePrefix':'dev'}]"
