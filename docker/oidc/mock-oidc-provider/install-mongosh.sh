set -e

if [ "$TARGETARCH" = "arm64" ];
  then export BUILT_MONGOSH_ARCH=arm64;
  else export BUILT_MONGOSH_ARCH=amd64;
fi

LATEST_MONGOSH_VERSION=$(curl https://info-mongodb-com.s3.amazonaws.com/com-download-center/mongosh.json | jq -r '.versions[0]._id')

echo "Building for $TARGETARCH"
echo "mongosh arch: ${BUILT_MONGOSH_ARCH}"
curl -f "https://downloads.mongodb.com/compass/mongodb-mongosh_${LATEST_MONGOSH_VERSION}_${BUILT_MONGOSH_ARCH}.deb" > "/mongodb-mongosh.deb"
dpkg -i "mongodb-mongosh.deb"
mongosh --version
