from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet


router = DefaultRouter()
router.register(r'users', UserViewSet, base_name='users')

urlpatterns = [
    re_path(r'^', include(router.urls)),
]