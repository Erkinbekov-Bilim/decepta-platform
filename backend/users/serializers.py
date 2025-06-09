from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile, EmailVerification, Complaint
from django.core.mail import send_mail
from decouple import config
import uuid, random, string

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = None 
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

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

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'nickname',
            'tag_nickname',
            'phone_number',
            'avatar',
            'header_image',
            'secret_key',
            'balance',
            'account_status',
            'role',
            'created_at',
        ]
        read_only_fields = ['secret_key', 'balance', 'account_status', 'role', 'created_at']

    def validate_nickname(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nickname cannot be empty.")
        qs = UserProfile.objects.filter(nickname=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This nickname is already taken.")
        return value

    def validate_tag_nickname(self, value):
        if not value.startswith('@'):
            raise serializers.ValidationError("Tag nickname must start with '@'.")
        qs = UserProfile.objects.filter(tag_nickname=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This tag nickname is already taken.")
        return value


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 6},
            'email': {'required': True},
            'username': {'required': False, 'allow_blank': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        username = validated_data.get('username')
        if not username:
            validated_data['username'] = validated_data['email'].split('@')[0] + str(uuid.uuid4())[:8]

        user = User.objects.create_user(**validated_data, is_active=False)
        UserProfile.objects.create(user=user, **profile_data)

        code = ''.join(random.choices(string.digits, k=6))
        verification = EmailVerification.objects.create(user=user, email=validated_data['email'], code=code)

        try:
            send_mail(
                subject='Email Verification',
                message=f'Your verification code is {code}',
                from_email=config('EMAIL_HOST_USER'),
                recipient_list=[validated_data['email']],
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
            if verification.is_used:
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
        fields = ['id', 'complainant', 'complaint_against', 'reason', 'created_at', 'resolved']
        read_only_fields = ['complainant', 'created_at', 'resolved']
        
        

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({"old_password": "Incorrect old password."})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user