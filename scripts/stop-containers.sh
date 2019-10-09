#!/bin/bash

# disconnect containers and clean up network
docker network disconnect store-abc-local-network store-abc-true-to-size-api
docker network disconnect store-abc-local-network store-abc-postgres
docker network rm store-abc-local-network

# stop and remove containers
docker rm store-abc-postgres -f
docker rm store-abc-true-to-size-api -f
