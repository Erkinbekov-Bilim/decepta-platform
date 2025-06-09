from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import CustomTokenObtainPairView
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = ([
    path('admin/', admin.site.urls),
    path('api/user/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/user/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('users.urls')),
    path("api/", include("crypto.urls")),
]) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

