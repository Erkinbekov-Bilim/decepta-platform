from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError
from django.utils import timezone
from datetime import timedelta
import secrets
import string

def generate_secret_key(length=20):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


class UserProfile(models.Model):
    ACCOUNT_STATUS_CHOICES = (
        ('active', 'Активный'),
        ('inactive', 'Неактивный'),
        ('frozen', 'Заморожен'),
        ('banned', 'Забанен'),
    )

    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    nickname = models.CharField(max_length=50)
    tag_nickname = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    account_status = models.CharField(max_length=20, choices=ACCOUNT_STATUS_CHOICES, default='active')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    header_image = models.ImageField(upload_to='headers/', blank=True, null=True)
    secret_key = models.CharField(max_length=20, unique=True, editable=False, null=True, blank=True)
    balance = models.DecimalField(max_digits=20, decimal_places=8, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.nickname and not self.tag_nickname:
            self.tag_nickname = f"@{self.nickname}"
        if not self.secret_key:
            self.secret_key = generate_secret_key()
        super().save(*args, **kwargs)

    def clean(self):
        if self.phone_number:
            existing = UserProfile.objects.filter(phone_number=self.phone_number)
            if self.pk:
                existing = existing.exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError({'phone_number': 'Этот номер уже используется.'})

    def __str__(self):
        return f"Профиль {self.user.username}"


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Verification for {self.email} - Code: {self.code}"


class Complaint(models.Model):
    complainant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    complaint_against = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_complaints', null=True)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Complaint against {self.complaint_against.username} by {self.complainant.username}"