from django.urls import path
from .views import RegisterView, MeView, MyViewUpdate

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path(
        "update/", MyViewUpdate.as_view(), name="user-update"
    ),  # PATCH - обновить профиль
]
