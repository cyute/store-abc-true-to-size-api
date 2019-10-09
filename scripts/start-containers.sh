#!/bin/bash

# create local network
docker network create store-abc-local-network

# run postgres container in local network
docker run --name store-abc-postgres \
    --network store-abc-local-network \
    -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    -d postgres:11.5-alpine

# wait for postgres to start up (this could be improved)
sleep 3

# run api containers in local network
docker run --name store-abc-true-to-size-api \
    --network store-abc-local-network \
    --init \
    -e NODE_ENV=docker \
    -p 3000:3000 \
    -d store-abc-true-to-size-api \
