from allauth.account.adapter import get_adapter
from django.utils.translation import gettext as _
from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password',
                  "name", "surname", "age")
        read_only_fields = ('id',)
        extra_kwargs = {'password': {'write_only': True}}

class CustomRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    name = serializers.CharField(max_length=20)
    surname = serializers.CharField(max_length=20)
    age = serializers.IntegerField(min_value=0, max_value=150)

    class Meta:
        model = User
        fields = ('email', 'password',
                  'name', 'surname', 'age')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(_("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', ''),
            'name': self.validated_data.get('name', ''),
            'surname': self.validated_data.get('surname', ''),
            'age': self.validated_data.get('age', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.email = self.cleaned_data.get('email')
        user.password = self.cleaned_data.get('password')
        user.name = self.cleaned_data.get('name')
        user.surname = self.cleaned_data.get('surname')
        user.age = self.cleaned_data.get('age')
        adapter.save_user(request, user, self)
        return user