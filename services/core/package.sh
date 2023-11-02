#!/usr/bin/env bash
echo "Packaging the app..."
PKG_VERSION=`node -p "require('./package.json').version"`
PKG_NAME=`node -p "require('./package.json').name"`

PACKAGE_NAME="$PKG_NAME-$PKG_VERSION.zip"

rimraf build

bestzip "$PACKAGE_NAME" cloud docker-compose.yml .env.dashboard.example .env.example

mkdir build
mv "$PACKAGE_NAME" build/

echo "Done!"
