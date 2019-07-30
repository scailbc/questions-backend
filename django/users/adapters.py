from allauth.account.adapter import DefaultAccountAdapter
from allauth.account import app_settings

class CustomAccountAdapter(DefaultAccountAdapter):

    def populate_username(self, request, user):
        """
        Fills in a valid username, if required and missing.  If the
        username is already present it is assumed to be valid
        (unique).
        """
        from allauth.account.utils import user_username, user_email, user_field
        first_name = user_field(user, 'name')
        last_name = user_field(user, 'surname')
        email = user_email(user)
        username = user_username(user)
        if app_settings.USER_MODEL_USERNAME_FIELD:
            user_username(
                user,
                username or self.generate_unique_username([
                    name,
                    surname,
                    email,
                    username,
                    'user']))

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        from allauth.account.utils import user_username, user_email, user_field

        data = form.cleaned_data
        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')
        username = data.get('username')
        user_email(user, email)
        user_username(user, username)
        if name:
            user_field(user, 'name', name)
        if surname:
            user_field(user, 'surname', surname)
        if 'password' in data:
            user.set_password(data["password"])
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding
            user.save()
        return user

    def get_user_search_fields(self):
        user = get_user_model()()
        return filter(lambda a: a and hasattr(user, a),
                      [app_settings.USER_MODEL_USERNAME_FIELD,
                       'name', 'surname', 'email'])