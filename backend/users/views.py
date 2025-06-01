from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, EmailVerificationSerializer, ComplaintSerializer, CustomTokenObtainPairSerializer
from .models import EmailVerification, UserProfile, Complaint
from django.utils import timezone
from datetime import timedelta
from decouple import config
import random
from django.core.mail import send_mail
import string


class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        print("Received data:", request.data)
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
    serializer = UserSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
  
class VerifyEmailView(APIView):
  permission_classes = [AllowAny]
  serializer_class = EmailVerificationSerializer
  
  def post(self, request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email = serializer.validated_data['email']
    code = serializer.validated_data['code']
    
    try:
      verification = EmailVerification.objects.get(email=email, code=code)
      if verification.is_expired():
        return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)
      if verification.is_used:
        return Response({"error": "Verification code has already been used"}, status=status.HTTP_400_BAD_REQUEST)
      
      user = verification.user
      user.is_active = True
      user.save()
      verification.is_used = True
      verification.save()
      verification.delete()
      
      return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)

    except EmailVerification.DoesNotExist:
      return Response({"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)
    
class ResendVerificationCodeView(APIView):
  permission_classes = [AllowAny]
  
  def post(self, request):
    email = request.data.get('email')
    try:
      user = User.objects.get(email=email, is_active=False)
      last_verification = EmailVerification.objects.filter(user=user).order_by('-created_at').first()
      if last_verification and last_verification.created_at > timezone.now() - timedelta(minutes=2):
        return Response({"error": "Verification code has already been sent within the last 2 minutes"}, status=status.HTTP_429_TOO_MANY_REQUESTS)
      
      EmailVerification.objects.filter(user=user).delete()
      code = ''.join(random.choices(string.digits, k=6))
      verification =  EmailVerification.objects.create(user=user, email=email, code=code)
      
      try:
        send_mail(
          subject='Email Verification',
          message=f'Your verification code is {code}',
          from_email=config('EMAIL_HOST_USER'),
          recipient_list=[email],
          fail_silently=False,
        )
        
        return Response({"message": "Verification code sent successfully"}, status=status.HTTP_200_OK)
      
      except Exception as e:
        verification.delete()
        return Response({"error": f"Email could not be sent: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except User.DoesNotExist:
      return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
class ComplaintView(generics.ListCreateAPIView):
  queryset = Complaint.objects.all()
  serializer_class = ComplaintSerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
    user = self.request.user
    if user.profile.role in ['admin', 'manager']:
      return Complaint.objects.all()
    return Complaint.objects.filter(complainant=user)
  
  def perform_create(self, serializer):
    serializer.save(complainant=self.request.user)