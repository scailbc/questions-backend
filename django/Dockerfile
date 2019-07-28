FROM python:3.7.4 as django-questions-backend

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/app

RUN mkdir django-questions-backend

WORKDIR /home/app/django-questions-backend

# Install libraries
ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD . /home/app/django-questions-backend/

EXPOSE 8000
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]