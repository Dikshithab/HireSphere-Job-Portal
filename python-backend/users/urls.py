from django.urls import path
from .views import ChangePasswordView, RegisterView,LoginView,ProfileView,DeleteAccountView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("delete-account/", DeleteAccountView.as_view(), name="delete-account"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]