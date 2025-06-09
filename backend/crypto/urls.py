from django.urls import path
from .views import CoinGeckoProxyView

urlpatterns = [
    path("proxy/coins/", CoinGeckoProxyView.as_view(), name="proxy_coins"),
]