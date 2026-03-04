from rest_framework import serializers
from .models import CustomUser, Hospital, Department

class PatientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=12)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'full_name', 'password']
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            role='patient',
            is_active=False
        )
        return user

class HospitalRegistrationSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(write_only=True, max_length=200)
    hospital_location = serializers.CharField(write_only=True, max_length=300)
    password = serializers.CharField(write_only=True, min_length=12)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'hospital_name', 'hospital_location']
    
    def create(self, validated_data):
        hospital = Hospital.objects.create(
            name=validated_data.pop('hospital_name'),
            location=validated_data.pop('hospital_location'),
            is_approved=False
        )
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=hospital.name,
            password=validated_data['password'],
            role='hospital_admin',
            hospital=hospital,
            is_active=False,
            is_verified=True
        )
        return user

class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=12, write_only=True)

class DeleteAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)