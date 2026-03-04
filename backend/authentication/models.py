from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'system_admin')
        return self.create_user(email, password, **extra_fields)

class Hospital(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Department(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name} - {self.hospital.name}"

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=300, blank=True)  # changed
    role = models.CharField(max_length=20, choices=[
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('hospital_admin', 'Hospital Admin'),
        ('system_admin', 'System Admin'),
    ], default='patient')
    
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True, related_name='doctors')
    hospital = models.OneToOneField(Hospital, on_delete=models.CASCADE, null=True, blank=True, related_name='admin')
    
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    code_created_at = models.DateTimeField(blank=True, null=True)
    
    password_reset_code = models.CharField(max_length=6, blank=True, null=True)
    reset_code_created_at = models.DateTimeField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']  # changed
    
    def __str__(self):
        return self.email