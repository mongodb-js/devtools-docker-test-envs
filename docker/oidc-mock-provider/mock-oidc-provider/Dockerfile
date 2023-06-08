FROM ubuntu:20.04
EXPOSE 27017

ARG TARGETARCH

ENV BUILT_MONGODB_VERSION=${MONGODB_VERSION}

RUN apt-get update -y && apt-get install -y \
  curl libcurl4 libgssapi-krb5-2 libldap-2.4-2 libwrap0 \
  libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit \
  snmp openssl liblzma5 jq

# First we start the oidc mock provider server.
RUN bash install-oidc-mock-provider.sh
