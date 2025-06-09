from django.urls import path
from .views import (
    CreateUserView,
    UserProfileView,
    VerifyEmailView,
    ResendVerificationCodeView,
    ComplaintView,
    ChangePasswordView,
    DeactivateAccountView,
)

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='user-register'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/deactivate/', DeactivateAccountView.as_view(), name='deactivate-account'),
    path('user/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('user/resend-verification/', ResendVerificationCodeView.as_view(), name='resend-verification'),
    path('user/complaints/', ComplaintView.as_view(), name='complaints'),
]