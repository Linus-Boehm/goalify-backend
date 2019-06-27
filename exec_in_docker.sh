#!/usr/bin/env bash
set -o pipefail
set -o nounset

APP_NAME="$(cat app-name)"
BUILD_IMAGE_NAME="${APP_NAME}-buildimage"

PROJECT_DIR="$(pwd)"

docker build -t "${BUILD_IMAGE_NAME}" ./scripts/docker/build-image/

docker network create goalify-net  &> /dev/null  || true
docker rm "${BUILD_IMAGE_NAME}" &> /dev/null || true

docker run -it \
    --name  "${BUILD_IMAGE_NAME}" \
    -p 3000:3000 -p 27017:27017 \
    --network goalify-net \
    --network-alias goalify-backend \
    -v "${PROJECT_DIR}:/usr/app" \
    -v /var/run/docker.sock:/var/run/docker.sock \
    "${BUILD_IMAGE_NAME}" /bin/bash -c "./scripts/development/development.sh"
