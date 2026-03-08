# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
# from . import views

# urlpatterns = [
#     # Registration
#     path('register/patient/', views.register_patient, name='register_patient'),
#     path('register/hospital/', views.register_hospital, name='register_hospital'),
    
#     # Email verification
#     path('verify-email/', views.verify_email, name='verify_email'),
    
#     # Authentication
#     path('login/', TokenObtainPairView.as_view(), name='login'),
#     path('logout/', TokenBlacklistView.as_view(), name='logout'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('profile/', views.get_profile, name='profile'),
    
#     # Password reset
#     path('password-reset/request/', views.request_password_reset, name='request_password_reset'),
#     path('password-reset/verify-code/', views.verify_reset_code, name='verify_reset_code'),
#     path('password-reset/reset/', views.reset_password, name='reset_password'),
    
#     # Account deletion
#     path('account/delete/request/', views.request_delete_account, name='request_delete_account'),
#     path('account/delete/', views.delete_account, name='delete_account'),
    
# ]


from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from . import views

urlpatterns = [
    # Registration
    path('register/patient/', views.register_patient, name='register_patient'),
    path('register/hospital/', views.register_hospital, name='register_hospital'),

    # Authentication
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.get_profile, name='profile'),

    # Password reset
    path('password-reset/request/', views.request_password_reset, name='request_password_reset'),
    path('password-reset/verify-code/', views.verify_reset_code, name='verify_reset_code'),
    path('password-reset/reset/', views.reset_password, name='reset_password'),

    # Account deletion
    path('account/delete/request/', views.request_delete_account, name='request_delete_account'),
    path('account/delete/', views.delete_account, name='delete_account'),
]