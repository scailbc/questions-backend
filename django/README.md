# Django Questions Backend

A simple test with Django, an api server to make admin users create tests and candidate users perform the tests.

**WARNING** You must append / to all api calls

## Installation

Install Docker (we used version 18.09.2).

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
docker exec -it django_api_1 bash -l
```

To launch the container (using Windows popwershell)
```bash
docker run --rm -p 8000:8000 -v ${PWD}:/home/app/django-questions-backend / -it django_api bash -l
```

## Notes

I'm following [this tutorial](https://docs.djangoproject.com/en/2.2/intro/tutorial01/).
