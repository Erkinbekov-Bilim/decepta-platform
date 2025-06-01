from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError
from django.utils import timezone
from datetime import timedelta

class UserProfile(models.Model):
  STATUS_CHOICES = (
    ('active', 'Active'),
    ('banned', 'Banned'),
    ('frozen', 'Frozen'),
  )
  
  ROLE_CHOICES = (
    ('user', 'User'),
    ('admin', 'Admin'),
    ('manager', 'Manager'),
  )
  
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
  nickname = models.CharField(max_length=50, blank=False)
  tag_nickname = models.CharField(max_length=50, blank=False)
  phone_number = models.CharField(max_length=15, blank=True, null=True)
  status = models.CharField(max_length=100, default='active')
  role = models.CharField(max_length=50, default='user')
  p2p_followers = models.IntegerField(default=0)
  p2p_rating = models.FloatField(default=0.0)
  created_at = models.DateTimeField(auto_now_add=True)
  
  def save(self, *args, **kwargs):
    if self.nickname and not self.tag_nickname:
      self.tag_nickname = f"@{self.nickname}"
    super().save(*args, **kwargs)
    
  def clean(self):
        if self.phone_number:
            existing = UserProfile.objects.filter(phone_number=self.phone_number)
            if self.pk:
                existing = existing.exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError({'phone_number': 'This phone number is already in use.'})
    
  def __str__(self):
    return f"Profile of {self.user.username}"
  

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
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
  complaint =models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_complaints', null=True)
  reason = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  resolved = models.BooleanField(default=False)
  
  def __str__(self):
    return f"Complaint against {self.user.username} by {self.complaints.username}"