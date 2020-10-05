# Bide Questions Backend

A simple test with [NodeJS](https://nodejs.org/en/) and [Express](https://expressjs.com/), an api server to make admin users create tests and candidate users perform the tests.

## Installation

Install Docker (we used version 19.03.13).

Build containers

```bash
docker-compose build
```

## Start server

Start with docker compose

```bash
docker-compose up
```

Enter inside the container

```bash
docker exec -it node_api_1 bash -l
```

To launch the container (using Windows powershell)
```bash
docker run --rm -p 8080:8080 -v ${PWD}:/home/app/node-questions-backend -it node_api bash -l
```
