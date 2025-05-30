from django.db import models
from django.contrib.auth.models import User
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
  
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
  phone_number = models.CharField(max_length=20, blank=True, null=True)
  nickname = models.CharField(max_length=50, unique=True)
  tag_nickname = models.CharField(max_length=51, unique=True)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
  role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
  p2p_followers = models.PositiveIntegerField(default=0)
  p2p_rating = models.FloatField(default=0.0)
  created_at = models.DateTimeField(auto_now_add=True)
  
  def save(self, *args, **kwargs):
    if not self.tag_nickname:
      self.tag_nickname = f"@{self.nickname}"
    super().save(*args, **kwargs)
    
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
  complaints =models.ForeignKey(User, on_delete=models.CASCADE, related_name='filled_complaints')
  reason = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  resolved = models.BooleanField(default=False)
  
  def __str__(self):
    return f"Complaint against {self.user.username} by {self.complaints.username}"