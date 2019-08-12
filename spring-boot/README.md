# Spring Questions Backend

A simple test with Spring Boot, an api server to make admin users create tests and candidate users perform the tests.

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
docker exec -it spring-boot_api_1 sh
```

To launch the container (using Windows popwershell)
```bash
docker run --rm -p 8080:8080 -v ${PWD}:/home/app/spring-questions-backend -it spring-boot_api sh
```
