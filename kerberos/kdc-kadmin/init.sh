#!/usr/bin/env bash

set -e

# Copy the keytab back in the volume
mv /mongodb.keytab /etc/krb5-keytabs/mongodb.keytab

# This is required in order to allow other containers to access this file:
chmod a+r /etc/krb5-keytabs/mongodb.keytab

krb5kdc
kadmind -nofork
