from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserProfile, EmailVerification, Complaint
import uuid
import random
import string
from django.core.mail import send_mail
from decouple import config


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(required=True, write_only=True)

  def validate(self, attrs):
      email = attrs.get('email')
      password = attrs.get('password')

      try:
          user = User.objects.get(email=email)
      except User.DoesNotExist:
          raise serializers.ValidationError('Invalid email or password.')

      if not user.check_password(password):
          raise serializers.ValidationError('Invalid email or password.')
      if not user.is_active:
          raise serializers.ValidationError('Account not verified. Please verify your email.')

      attrs['username'] = user.username
      data = super().validate(attrs)
      return data
      
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = 'phone_number nickname tag_nickname status role p2p_followers p2p_rating created_at'.split()
        read_only_fields = 'status role p2p_followers p2p_rating created_at'.split()

    def validate_nickname(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Nickname cannot be empty")
        return value

    def validate_tag_nickname(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Tag nickname cannot be empty")
        if value and not value.startswith('@'):
            raise serializers.ValidationError("Tag nickname must start with @")
        return value
    
class UserSerializer(serializers.ModelSerializer):
  profile = UserProfileSerializer(source='userprofile' ,required=False)
  
  class Meta:
    model = User
    fields = 'id username email password profile'.split()
    extra_kwargs = {'password': {'write_only': True, 'min_length': 6}, 'email': {'required': True}, 'username': {'required': False, 'allow_blank': True}}
    
  def validate_email(self, value):
    if User.objects.filter(email=value).exists():
      raise serializers.ValidationError("Email already exists")
    return value
  
  def create(self, validated_data):
    profile_data = validated_data.pop('profile', {})
    if 'username'not in validated_data or not validated_data['username']:
      email = validated_data.get('email', '')
      validated_data['username'] = email.split('@')[0] + str(uuid.uuid4())[:8]
      
    user = User.objects.create_user(**validated_data, is_active=False)
    
    UserProfile.objects.create(user=user, **profile_data)
    
    code = ''.join(random.choices(string.digits, k=6))
    verification = EmailVerification.objects.create(
      user=user,
      email=validated_data['email'],
      code=code,
    )
    
    try:
      send_mail(
        subject='Email Verification',
        message=f'Your verification code is {code}',
        from_email=config('EMAIL_HOST_USER'),
        recipient_list=[validated_data['email']],
        fail_silently=False,
      )
    
    except Exception as e:
      user.delete()
      verification.delete()
      raise serializers.ValidationError(f"Email could not be sent: {str(e)}")
    
    return user
  
class EmailVerificationSerializer(serializers.Serializer):
  email = serializers.EmailField()
  code = serializers.CharField(max_length=6)
  
  def validate(self, data):
    try:
      verification = EmailVerification.objects.get(email=data['email'], code=data['code'])
      if verification.is_expired():
        raise serializers.ValidationError("Verification code has expired")
      if  verification.is_used:
        raise serializers.ValidationError("Verification code has already been used")

    except EmailVerification.DoesNotExist:
      raise serializers.ValidationError("Invalid verification code")
    
    return data
  
class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            if user.is_active:
                raise serializers.ValidationError("User is already verified")
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist")
        return value
  
class ComplaintSerializer(serializers.ModelSerializer):
  class Meta:
    model = Complaint
    fields = 'id user reason created_at resolved'.split()
    read_only_fields = 'complaint created_at resolved'.split()
    
  def create(self, validated_data):
    validated_data['complainant'] = self.context['request'].user
    return super().create(validated_data)