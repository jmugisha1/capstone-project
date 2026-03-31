from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .serializers import (
    PatientRegistrationSerializer,
    HospitalRegistrationSerializer,
    RequestPasswordResetSerializer,
    VerifyResetCodeSerializer,
    ResetPasswordSerializer,
    DeleteAccountSerializer,
)
from .models import CustomUser
from .utils import generate_verification_code, send_password_reset_email


@api_view(['POST'])
@permission_classes([AllowAny])
def register_patient(request):
    """Register a new patient — auto-verified, no email code needed."""
    serializer = PatientRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Registration successful. You can now log in.',
            'email': user.email,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_hospital(request):
    """Register a new hospital — pending admin approval."""
    serializer = HospitalRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Hospital registration successful. Your account is pending admin approval.',
            'email': user.email,
            'hospital_name': user.hospital.name,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """Send a password reset code to the user's email."""
    serializer = RequestPasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        code = generate_verification_code()
        user.password_reset_code = code
        user.reset_code_created_at = timezone.now()
        user.save()

        send_password_reset_email(user.email, code)

        return Response({
            'message': 'Password reset code sent to your email.',
            'email': user.email,
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_code(request):
    """Verify a password reset code."""
    serializer = VerifyResetCodeSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.password_reset_code != code:
            return Response({'error': 'Invalid reset code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Code verified. You can now reset your password.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password using a verified code."""
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.password_reset_code != code:
            return Response({'error': 'Invalid reset code'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.password_reset_code = None
        user.reset_code_created_at = None
        user.save()

        return Response({'message': 'Password reset successfully. You can now log in.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_delete_account(request):
    """Request account deletion."""
    serializer = RequestPasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.role == 'patient':
            code = generate_verification_code()
            user.password_reset_code = code
            user.reset_code_created_at = timezone.now()
            user.save()

            send_password_reset_email(user.email, code)

            return Response({
                'message': 'Deletion code sent to your email.',
                'requires_code': True,
            }, status=status.HTTP_200_OK)

        elif user.role == 'hospital_admin':
            return Response({
                'message': 'Your deletion request has been submitted for admin review.',
                'requires_code': False,
            }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def delete_account(request):
    """Delete a patient account using a verified code."""
    serializer = DeleteAccountSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.role != 'patient':
            return Response({'error': 'Only patients can delete their account with a code'}, status=status.HTTP_400_BAD_REQUEST)

        if user.password_reset_code != code:
            return Response({'error': 'Invalid deletion code'}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'role': user.role,
    })