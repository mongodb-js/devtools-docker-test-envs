#!/usr/bin/env bash

set -e

# Copy the keytab back in the volume
mv /mongodb.keytab /etc/krb5-keytabs/mongodb.keytab

# This is required in order to allow other containers to access this file:
chmod a+r /etc/krb5-keytabs/mongodb.keytab

touch /var/log/krb5libs.log
touch /var/log/krb5kdc.log
touch /var/log/kadmind.log

krb5kdc
kadmind -nofork &

tail -fq /var/log/krb5kdc.log /var/log/kadmind.log
