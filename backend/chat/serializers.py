from rest_framework import serializers
from .models import Conversation

class ConversationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "title", "created_at"]

class ConversationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "title", "symptoms", "initial_predictions", "questions_answers", "final_predictions", "specialist", "created_at"]