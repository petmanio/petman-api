#!/usr/bin/env bash
set -e

rm -rf ./dist/
npm run build:prod

# rsync -a --delete --progress config/ production@petman.io:/opt/petman-api/config
rsync -a --delete --progress dist/ production@petman.io:/opt/petman-api/dist
rsync -a --delete --progress package.json production@petman.io:/opt/petman-api/package.json
# rsync -a --delete --progress package-lock.json production@petman.io:/opt/petman-api/package-lock.json
