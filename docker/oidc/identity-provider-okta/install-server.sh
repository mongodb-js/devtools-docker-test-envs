set -e

if [ "$TARGETARCH" = "arm64" ];
  then export BUILT_MONGODB_ARCH=aarch64;
  else export BUILT_MONGODB_ARCH=x86_64;
fi;

echo "Building for $TARGETARCH"
echo "mongodb arch: ${BUILT_MONGODB_ARCH}"

curl -f "https://downloads.mongodb.com/linux/mongodb-linux-${BUILT_MONGODB_ARCH}-enterprise-ubuntu2004-7.0.0-rc2.tgz" | tar -xz

mv mongodb-linux-${BUILT_MONGODB_ARCH}-enterprise-ubuntu2004-7.0.0-rc2 mongodb
mongodb/bin/mongod --version
