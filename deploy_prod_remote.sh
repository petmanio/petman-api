#!/usr/bin/env bash
set -e

rm -rf ./dist/
npm run build:prod

rsync -a --delete --progress config/ andranik@petman.io:/opt/petman-api/config
rsync -a --delete --progress dist/ andranik@petman.io:/opt/petman-api/dist
rsync -a --delete --progress package.json andranik@petman.io:/opt/petman-api/package.json
rsync -a --delete --progress package-lock.json andranik@petman.io:/opt/petman-api/package-lock.json
