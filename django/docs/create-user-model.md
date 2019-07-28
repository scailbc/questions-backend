# Create User Model

Django provides a default user model thanks to `django.contrib.auth` and `django.contrib.contenttypes`.

The default user is not exactly what we want, so we're gong to [substitute it with a custom user](https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#substituting-a-custom-user-model).

It's highly recommended to set up a custom User model when starting a new Django project.

Be aware that a Django projects can be made of reusable parts, so you should think if you really should use a custom user or a default user. For this project we don't care about making it reusable.

Enter inside the container

```bash
docker-compose up
docker exec -it django_api_1 bash -l
```
Create a users app

```bash
python manage.py startapp users
```

Add the new app and the new Userto `django_questions_app/settings-py`

```py
INSTALLED_APPS = [
    ...
    'users',
]

AUTH_USER_MODEL = 'users.User'
```

We are using `AbstractBaseUser` to remove all unneccessary fields, see this tutorial [Creating a Custom User Model in Django](https://testdriven.io/blog/django-custom-user-model/)

Now we can create a new user from the shell

```bash
python manage.py shell
```

```py
>>> from users.models import User
>>> User.objects.create(email="cli@mail.it", password="password", name="Clint", surname="East")
<User: cli@mail.it>
>>> User.objects.all()
<QuerySet [<User: cli@mail.it>]>
>>> User.objects.all()[0].id
1
>>> User.objects.all()[0].password
'password'
>>> User.objects.all()[0].age
```

Create the serializers using ModelSerializer

Create the views using ModelViewSet

We need to install `rest_framework`, which allows to easily create the APIs. We also have to update `requirements.txt` and rebuild the image.

```bash
pip install djangorestframework
pip freeze > requirements.txt
```

Add to installed app
```py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'rest_framework.authtoken',
]
```