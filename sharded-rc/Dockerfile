FROM ubuntu:20.04
EXPOSE 27017

ARG MONGODB_VERSION=6.0.0-rc4
ARG MONGOSH_VERSION=1.6.0
ARG TARGETARCH

RUN apt-get update -y && apt-get install -y \
  curl libcurl4 libgssapi-krb5-2 libldap-2.4-2 libwrap0 \
  libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit \
  snmp openssl liblzma5 jq

COPY install-mongosh.sh /install-mongosh.sh
COPY install-server.sh /install-server.sh
COPY rscs_shards.sh /rscs_shards.sh

RUN bash install-mongosh.sh
RUN bash install-server.sh

ENV  BUILT_MONGODB_VERSION=${MONGODB_VERSION}
CMD ["bash", "-c", "bash /rscs_shards.sh mongodb/bin"]
