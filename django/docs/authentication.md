# Authentication

Django has his own default authentication system, but it's better to use the library [rest_auth](https://django-rest-auth.readthedocs.io/en/latest/introduction.html).

Install the library, update the `requirements.txt` file and rebuild the image

```bash
pip install django-rest-auth
pip freeze > requirements.txt
```

Add rest_auth app to INSTALLED_APPS in your django settings.py:

```py
INSTALLED_APPS = (
    ...,
    'rest_framework',
    'rest_framework.authtoken',
    ...,
    'rest_auth'
)
```

Now we have to add the urls, inside our `django_questions_app/urls.py`

```py
urlpatterns = [
    path('', include('rest_auth.urls')),
    ...
]
```

This provides all routes related to login:
- ^login/$ [name='rest_login']
- ^logout/$ [name='rest_logout']
- ^password/change/$ [name='rest_password_change'] 
- ^password/reset/$ [name='rest_password_reset']
- ^password/reset/confirm/$ [name='rest_password_reset_confirm']

The registration routes are optional, you have to install [Allauth](https://django-allauth.readthedocs.io/en/latest/installation.html)

```bash
pip install django-allauth
pip freeze > requirements.txt
```

Add app to INSTALLED_APPS in your django settings.py:

```py
INSTALLED_APPS = (
    ...
    # The following apps are required:
    'django.contrib.auth',
    'django.contrib.messages',
    'django.contrib.sites',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',  # This should be optional, but it's actually required

    'rest_auth.registration',
)

SITE_ID = 1
```
Since we do not have the `username` param in our User model, we have to set

```py
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_REQUIRED = True
```

See [Allauth Custom User Models](https://django-allauth.readthedocs.io/en/latest/advanced.html#custom-user-models)

You can add the routes with

```py
urlpatterns = [
    path('registration/', include('rest_auth.registration.urls')),
    ...
]
```

Here you could run the migrations, but there other customizations to do.

To customize the fields in the registration request we have to create a custom serializer

```py
REST_AUTH_REGISTER_SERIALIZERS={
    'REGISTER_SERIALIZER':'users.serializers.CustomRegisterSerializer',
}
```

After the first registration, all the requests that are not GET will return an error

```
403 Forbidden
{
    "detail": "CSRF Failed: CSRF token missing or incorrect."
}
```

More informations about the problem from [django rest framework](https://www.django-rest-framework.org/api-guide/authentication/#sessionauthentication), [django](https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax) and [issue Tivix/django-rest-auth#164](https://github.com/Tivix/django-rest-auth/issues/164).

We are going to use a Token authentication

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}
```

Finally you have to run migrations

```bash
python manage.py migrate
```

The User model needs a [UserManager](https://docs.djangoproject.com/en/2.2/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model)

> WARNING If the user encoded password starts with `UNUSABLE_PASSWORD_PREFIX = '!'` the registration will work, but the login will not

Since we changed the default behaviour, we should create a custom [allauth adapter](https://django-allauth.readthedocs.io/en/latest/advanced.html?highlight=adapter#creating-and-populating-user-instances), an adapter is an object that contains many utility functions used to create users, redirect and send emails.

```py
ACCOUNT_ADAPTER = "allauth.account.adapter.DefaultAccountAdapter"
```

In the custom adapter we change only the methods that use user params with the default names: first_name to name, last_name to surname, password1 to password and password2 to confirm_password.

Now everything is ready to signup and signin a User.Both `registration/` and `login/` APIs will return a valid token

```json
{
    "key": "d8d9e76bafa746535576e42d38945629aedf8bb4"
}
```

Add the key to the header of all requests, the prefix is _token_ (both uppercase and lowercase works)

```
Authorization: "Token d8d9e76bafa746535576e42d38945629aedf8bb4"
```

To make an API available only throught authentication add the permissions to the view

```py
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
```
