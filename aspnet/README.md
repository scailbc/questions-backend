# ASP.NET Core Questions Backend

A simple test with [.NET](https://learn.microsoft.com/en-us/dotnet/core/introduction) and [ASP.NET Core](https://github.com/dotnet/aspnetcore), an api server to make admin users create tests and candidate users perform the tests.

## Installation

Install Docker (we used version 20.10.17).

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
docker exec -it aspnet_api_1 bash -l
```

To launch the container (using Windows powershell)
```bash
docker run --rm -p 8080:8080 -v ${PWD}:/home/app/aspnet-questions-backend -it aspnet_api bash -l
```
