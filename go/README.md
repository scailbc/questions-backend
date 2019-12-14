# Spring Questions Backend

A simple test with Go and [Gorilla Mux](https://github.com/gorilla/mux), an api server to make admin users create tests and candidate users perform the tests.

## Installation

Install Docker (we used version 18.09.7).

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
docker exec -it go_api_1 bash -l
```

To launch the container (using Windows powershell)
```bash
docker run --rm -p 8080:8080 -v ${PWD}:/home/app/go-questions-backend -it go_api bash -l
```
