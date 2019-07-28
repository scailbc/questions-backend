# Create new Project

Starting from the `Dockerfile` and the `docker-compose.yml` you can create a new project passing through [Docker](https://www.docker.com/).

First build the image

```bash
docker-compose build
```

Then launch a container, do not use the `docker-compose.yml`, since it's intended to launch a django server and we still have to create it. We have to mount the current folder as a volume, to apply the projects created inide Docker to our folder

```bash
docker run --rm -v ${PWD}:/home/app/django-questions-backend -it django_api bash -l
```

Install Django

```bash
pip install Django
```

Now i'll follow [this tutorial]().

Create a new project, project names only have numbers, letters and underscores. Add `.` after project name to create project in the current folder

```bash
django-admin startproject django_questions_app .
```

The projects is ready, now you can save inside `requirements.txt` all the installed libraries.

```bash
pip freeze > requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Now you can start the server

```bash
python manage.py runserver 8000:8000
```

The container currently do not expose any port, so the server is running but it's not reachable from the browser.

Exit from the container, build again the image (since the `requirements.txt` file was updated) and launch the server with `docker-compose`

```bash
docker-compose build
docker-compose up
```
