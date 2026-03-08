from django.urls import path
from . import views

urlpatterns = [
    path("conversations/", views.list_conversations, name="list_conversations"),
    path("conversations/create/", views.create_conversation, name="create_conversation"),
    path("conversations/<int:pk>/", views.conversation_detail, name="conversation_detail"),
    path("conversations/<int:pk>/message/", views.send_message, name="send_message"),
    path('conversations/<int:pk>/title/', views.update_conversation_title, name='update_conversation_title'),
]