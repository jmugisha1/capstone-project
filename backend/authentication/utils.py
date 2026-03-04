# This file contains helper functions for generating codes and sending emails.
# generate_verification_code() - Creates random 6-digit number (e.g., "582394")
# send_verification_email() - Sends email with the code to user

from django.core.mail import send_mail
from django.conf import settings
import random
import string

def generate_verification_code():
    """Generate 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(email, code):
    """Send verification code to user email"""
    subject = 'Verify Your Email - Hospital System'
    message = f'{code}'
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )

def send_password_reset_email(email, code):
    """Send password reset code to user email"""
    subject = 'Password Reset Code - Hospital System'
    message = f'{code}'
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )