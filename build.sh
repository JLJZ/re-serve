#!/bin/sh

npm install
npm run build

mkdir www
mkdir www/frontend
cp -r backend www
cp -r node_modules www
cp -r frontend/dist www/frontend
cp index.js www
