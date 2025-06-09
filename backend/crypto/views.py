import httpx
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class CoinGeckoProxyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": 20
        }

        try:
            response = httpx.get(url, params=params, timeout=10)
            response.raise_for_status()
            return Response(response.json(), status=status.HTTP_200_OK)
        except httpx.RequestError as exc:
            return Response(
                {"error": f"CoinGecko request failed: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except httpx.HTTPStatusError as exc:
            return Response(
                {"error": f"CoinGecko HTTP error: {exc.response.status_code}"},
                status=exc.response.status_code
            )
