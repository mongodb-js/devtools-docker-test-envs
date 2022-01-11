#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"

TLS_KEYS_DIR='tls'

rm -Rf ${TLS_KEYS_DIR}
mkdir -p ${TLS_KEYS_DIR}
cd ${TLS_KEYS_DIR}

# 1. Make ca.key and ca.pem
openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.pem -subj "/C=AU/ST=NSW/O=Organisation/OU=CAs/CN=root/emailAddress=user@domain.com"

# 2. Make server.pem
# two random digits number
echo "00" > file.srl
openssl genrsa -out server.key 2048
openssl req -key server.key -new -out server.req -subj  "/C=AU/ST=NSW/O=Organisation/OU=servers/CN=localhost/emailAddress=user@domain.com"
openssl x509 -req -in server.req -CA ca.pem -CAkey ca.key -CAserial file.srl -out server.crt -days 3650 -sha256
cat server.key server.crt > server.pem
openssl verify -CAfile ca.pem server.pem

# two random digits number
echo "01" > file.srl
openssl genrsa -out server-named.key 2048
openssl req -key server-named.key -new -out server-named.req -subj  "/C=AU/ST=NSW/O=Organisation/OU=servers/CN=mongodb-tls-server-named/emailAddress=user@domain.com"
openssl x509 -req -in server-named.req -CA ca.pem -CAkey ca.key -CAserial file.srl -out server-named.crt -days 3650 -sha256
cat server-named.key server-named.crt > server-named.pem
openssl verify -CAfile ca.pem server-named.pem

# 3. Make client.pem (in compass we will only use client.crt and client.key)
openssl genrsa -out client.key 2048
openssl req -key client.key -new -out client.req -subj "/C=AU/ST=NSW/O=Organisation/OU=clients/CN=client1/emailAddress=user@domain.com"
openssl x509 -req -in client.req -CA ca.pem -CAkey ca.key -CAserial file.srl -out client.crt -days 3650 -sha256
cat client.key client.crt > client.pem
openssl verify -CAfile ca.pem client.pem

sleep 1

rm -f server.key server.crt ca.key *.srl *.req
