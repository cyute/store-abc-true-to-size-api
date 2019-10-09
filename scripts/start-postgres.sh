#!/bin/bash

docker run --name store-abc-postgres \
    -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    -d postgres:11.5-alpine
