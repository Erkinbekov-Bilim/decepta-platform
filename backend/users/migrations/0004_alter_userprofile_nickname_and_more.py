# Generated by Django 5.2.1 on 2025-05-31 17:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_complaint_complaints_complaint_complaint'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='nickname',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='p2p_followers',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='phone_number',
            field=models.CharField(max_length=15, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='role',
            field=models.CharField(default='user', max_length=50),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='status',
            field=models.CharField(default='active', max_length=100),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='tag_nickname',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
