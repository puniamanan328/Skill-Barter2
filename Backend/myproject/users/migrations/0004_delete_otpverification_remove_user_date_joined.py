# Generated by Django 5.0.7 on 2024-07-24 10:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_otpverification_user_date_joined'),
    ]

    operations = [
        migrations.DeleteModel(
            name='OTPVerification',
        ),
        migrations.RemoveField(
            model_name='user',
            name='date_joined',
        ),
    ]
