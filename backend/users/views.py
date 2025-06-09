from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
import random, string
from decouple import config
from django.contrib.auth.models import User
from .models import EmailVerification, Complaint
from .serializers import (
    UserSerializer,
    EmailVerificationSerializer,
    ComplaintSerializer,
    CustomTokenObtainPairSerializer,
    ResendVerificationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)


class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        profile_data = request.data.get('profile', {})
        if profile_data:
            profile_serializer = UserProfileSerializer(user.userprofile, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        return Response(user_serializer.data)

    def delete(self, request):
        request.user.delete()
        return Response({"message": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
    
    
class DeactivateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()
        user.userprofile.account_status = 'inactive'
        user.userprofile.save()
        return Response({"message": "Account deactivated."}, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            verification = EmailVerification.objects.get(email=serializer.validated_data['email'], code=serializer.validated_data['code'])
        except EmailVerification.DoesNotExist:
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

        user = verification.user
        user.is_active = True
        user.save()

        verification.is_used = True
        verification.save()
        verification.delete()

        return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)


class ResendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        last_verification = EmailVerification.objects.filter(user=user).order_by('-created_at').first()
        if last_verification and last_verification.created_at > timezone.now() - timedelta(minutes=2):
            return Response({"error": "Verification code already sent recently."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        EmailVerification.objects.filter(user=user).delete()
        code = ''.join(random.choices(string.digits, k=6))
        EmailVerification.objects.create(user=user, email=email, code=code)

        try:
            send_mail(
                subject='Email Verification',
                message=f'Your verification code is {code}',
                from_email=config('EMAIL_HOST_USER'),
                recipient_list=[email],
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Verification code resent successfully."}, status=status.HTTP_200_OK)


class ComplaintView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.userprofile.role in ['admin', 'manager']:
            return Complaint.objects.all()
        return Complaint.objects.filter(complainant=user)

    def perform_create(self, serializer):
        serializer.save(complainant=self.request.user)