#!/usr/bin/env bash

function fail {
  echo $1 >&2
  exit 1
}

function retry {
  local n=1
  local max=30
  local delay=2
  while true; do
    "$@" && break || {
      if [[ $n -lt $max ]]; then
        ((n++))
        echo "Command failed. Attempt $n/$max:"
        sleep $delay;
      else
        fail "The command has failed after $n attempts."
      fi
    }
  done
}

function configure {
  mongo admin \
  --username root \
  --password password123 \
  --host mongodb-rs-1 \
  --port 28001 \
  --eval '
    const config = rs.conf() || {members: []};

    const analyticsNode = config.members.find(
      function(m) { return m.host.startsWith("mongodb-rs-3"); }
    );

    if (!analyticsNode) {
      throw new Error("rs not ready");
    }

    analyticsNode.tags = {"nodeType" : "ANALYTICS"};

    rs.reconfig(config);
    printjson(rs.conf());
  '
}

retry configure
