from django.urls import path
from . import views

urlpatterns = [
    path("conversations/", views.list_conversations),
    path("conversations/create/", views.create_conversation),
    path("conversations/<int:pk>/", views.conversation_detail),
    path("conversations/<int:pk>/save/", views.save_conversation),
]