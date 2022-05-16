#!/bin/bash
function prepare_prisma_client_lambda_layer() {
  echo "Cleaning up workspace ..."
  rm -rf nodejs
  
  echo "Creating layer ..."
  mkdir -p nodejs/node_modules/.prisma
  mkdir -p nodejs/node_modules/@prisma

  echo "Prepare prisma client lambda layer ..."
  cp -r ../../../../node_modules/.prisma/client nodejs/node_modules/.prisma
  cp -r ../../../../node_modules/@prisma nodejs/node_modules

  echo "Removing all runtimes"
  find nodejs/node_modules/.prisma -name '*.node' -delete

  echo "Copyng libquery_engine-rhel-openssl-1.0.x.so.node"
  cp ../../../../node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node nodejs/node_modules/.prisma/client

  echo "Remove prisma CLI..."
  rm -rf nodejs/node_modules/@prisma/cli

  echo "Compressing ..."
  zip -9 --filesync --move --quiet --recurse-paths prisma-client.zip nodejs/

  echo "Moving zipped files ..."
  mv prisma-client.zip ..
}

prepare_prisma_client_lambda_layer