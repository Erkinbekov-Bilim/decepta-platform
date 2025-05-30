from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, EmailVerification, Complaint
import uuid
import random
import string
from django.core.mail import send_mail
from decouple import config

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = 'phone_number nickname tag_nickname status role p2p_followers p2p_rating'.split()
    read_only_fields = 'status role p2p_followers p2p_rating'.split()
    
class UserSerializer(serializers.ModelSerializer):
  profile = UserProfileSerializer(required=False)
  
  class Meta:
    model = User
    fields = 'id username email password profile'.split()
    extra_kwargs = {'password': {'write_only': True}, 'email': {'required': True}}
    
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
  
class ComplaintSerializer(serializers.ModelSerializer):
  class Meta:
    model = Complaint
    fields = 'id user reason created_at resolved'.split()
    read_only_fields = 'complaints created_at resolved'.split()
    
  def create(self, validated_data):
    validated_data['complaints'] = self.context['request'].user
    return super().create(validated_data)