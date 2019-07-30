from rest_framework import viewsets
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.all()