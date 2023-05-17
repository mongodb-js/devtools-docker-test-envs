#!/usr/bin/env bash

set -e

if [ $# -ne 2 ]; then
    echo "Usage: run.sh <mongodb_version> <port>"
    exit
fi

docker build \
  --build-arg MONGODB_VERSION=$1 \
  -t mongodb-rc:$1 .

docker run -p "$2:27017" \
  "mongodb-rc:$1"
