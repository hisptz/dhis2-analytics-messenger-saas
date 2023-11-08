#!/bin/bash
PKG_VERSION=`node -p "require('./package.json').version"`

echo  "Building docker images for services core, visualizer, messaging, and panel app"


#echo "Building panel..."
#docker build . -f apps/panel/Dockerfile -t hisptanzania/dam-saas-panel:latest --platform linux/amd64
#docker push hisptanzania/dam-saas-panel:latest
#echo "Done!"
#
#echo "Building core..."
#docker build . -f services/core/Dockerfile -t hisptanzania/dam-saas-core:latest --platform linux/amd64
#docker push hisptanzania/dam-saas-core:latest
#echo "Done!"

echo "Building messaging..."
docker build . -f services/messaging/Dockerfile -t hisptanzania/dam-saas-messaging:latest --platform linux/amd64
docker push hisptanzania/dam-saas-messaging:latest
echo "Done"

#echo "Building visualizer..."
#docker build . -f services/visualizer/Dockerfile -t hisptanzania/dam-saas-visualizer:latest --platform linux/amd64
#docker push hisptanzania/dam-saas-visualizer:latest
#echo "Done"

