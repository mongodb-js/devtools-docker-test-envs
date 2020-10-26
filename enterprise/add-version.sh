#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"

mkdir "$1"
cd "$1"
curl -O --remote-name-all "https://raw.githubusercontent.com/docker-library/mongo/master/$1/{Dockerfile,docker-entrypoint.sh}"

chmod 755 ./docker-entrypoint.sh

HEAD=`head -1 Dockerfile`
TAIL=`tail -n +2 Dockerfile`

echo "${HEAD}" > Dockerfile

#
# Add to the build here:
#
echo '
#
# GSSAPI deps
#
RUN apt-get update -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
  krb5-user \
  libsasl2-modules-gssapi-mit \
  openldap-clients \
  nss-pam-ldapd
' >> Dockerfile
echo "${TAIL}" >> Dockerfile
