## Description

A REST-ful API to store and retrieve true-to-size data on Store ABC products.

This API uses [NestJS](https://docs.nestjs.com/) which is a TypeScript first framework for node server-side applications.  One nice thing about it is that it can use either Express or Fastify as the HTTP server implementation.  It also provides a lot of abstractions (dependency injection, lifecycle events, and testing) that make developing the service easier.

This API uses [TypeORM](https://typeorm.io/#/) as it's ORM.  This framework is also TypeScript first and supports numerous types of databases (including Postgres).  It also includes convenient ways to manage the migrations for your database.  For simplicity, this service runs the migrations on server startup and the migrations are included in `/src/migrations`.  This approach ensures that the current state of the database schema is accurately reflected on each git commit.

## Local Development
The steps below are required to work on the API locally.

### Software Pre-reqs
1. Install node (currently using v12.11.1)
2. Install npm (currently using v6.11.3)
3. Install yarn (currently using v1.19.0)
4. Install docker (https://docs.docker.com/)

### Installation
```bash
$ yarn install
```

### Start Postgres Container
This uses Docker to run a version of Postgres that can be used for local development and testing.  This container needs to be running to
start the application locally or to run any of the tests.

```bash
$ ./scripts/start-postgres.sh
```

### Running the app
```bash
$ yarn start:dev
```

### Test and Lint
```bash
# lint code
$ yarn lint

# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# run linter and all tests
$ yarn test:all
```

### Unit Test Coverage
Typically you would have more unit tests than integration tests.  In this coding challenge I have most of my coverage from integration tests.  I've included this script as an example of how to set up unit test coverage.

```bash
# unit test coverage
$ yarn test:cov
```

## Building and Running the API in Docker
As an example of how I would deploy the API, I have included scripts to build a Docker image and run containers of both the API and Postgres on the same network.  This could also have been accomplished using [Docker Compose](https://docs.docker.com/compose/install/).

**Note:** Be sure the API and Postgres containers are stopped prior to executing this script.

### Build the Docker image for the API
```bash
$ ./scripts/build-api.sh
```

### Create a network and start both Postgres and API containers
```bash
$ ./scripts/start-containers.sh
```

### Clean up network and running containers
```bash
$ ./scripts/stop-containers.sh
```

## REST endpoints
These are some simple curl commands if you would like to test the service manually.

### To add a new product
```bash
$ curl -d '{"name":"Adidas Yeezy"}' -H 'Content-Type: application/json' -X POST http://localhost:3000/products -i
```
**response:**
```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 67
ETag: W/"43-AJ0Y2fAdm/hXLeBjEupc4/Hv1NA"
Date: Mon, 14 Oct 2019 03:46:00 GMT
Connection: keep-alive

{"name":"Adidas Yeezy","id":"e859b9b4-7ade-4177-8ca0-1e86b227839a"}
```

### To add a review (with true to size data)
```bash
$ curl -d '{"trueToSize": 3}' -H 'Content-Type: application/json' -X POST http://localhost:3000/products/e859b9b4-7ade-4177-8ca0-1e86b227839a/reviews -i
```
**response:**
```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 166
ETag: W/"a6-fppQ+BNZFJZXlZZnCmYnwOMMajA"
Date: Mon, 14 Oct 2019 03:46:18 GMT
Connection: keep-alive

{"name":"Adidas Yeezy","id":"e859b9b4-7ade-4177-8ca0-1e86b227839a","reviews":[{"trueToSize":3,"id":"9df5b57a-58fc-4a3a-8a20-de45591b58bb"}],"trueToSizeCalculation":3}
```

### To get an existing product
```bash
$ curl http://localhost:3000/products/e859b9b4-7ade-4177-8ca0-1e86b227839a -i
```
**response:**
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 166
ETag: W/"a6-fppQ+BNZFJZXlZZnCmYnwOMMajA"
Date: Mon, 14 Oct 2019 03:46:33 GMT
Connection: keep-alive

{"name":"Adidas Yeezy","id":"e859b9b4-7ade-4177-8ca0-1e86b227839a","reviews":[{"trueToSize":3,"id":"9df5b57a-58fc-4a3a-8a20-de45591b58bb"}],"trueToSizeCalculation":3}
```

## Future Improvements

- Add [Swagger](https://docs.nestjs.com/recipes/swagger) to produce API documentation for public consumption
- Replace `sleep 3` in `start-containers.sh` with a wrapper script that waits for Postgres to start. For example: https://github.com/vishnubob/wait-for-it
- Add `catch` to handle scenario where service cannot connect to database (can also add retries).  Gracefully shut down service.
