from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationListSerializer, ConversationDetailSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    search = request.query_params.get("search", "")
    conversations = Conversation.objects.filter(user=request.user)
    if search:
        conversations = conversations.filter(title__icontains=search)
    return Response(ConversationListSerializer(conversations, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    conv = Conversation.objects.create(user=request.user)
    return Response(ConversationListSerializer(conv).data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation_detail(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(ConversationDetailSerializer(conv).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_conversation(request, pk):
    try:
        conv = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    conv.title = request.data.get("title", conv.title)
    conv.symptoms = request.data.get("symptoms", conv.symptoms)
    conv.initial_predictions = request.data.get("initial_predictions", conv.initial_predictions)
    conv.questions_answers = request.data.get("questions_answers", conv.questions_answers)
    conv.final_predictions = request.data.get("final_predictions", conv.final_predictions)
    conv.specialist = request.data.get("specialist", conv.specialist)
    conv.save()

    return Response(ConversationDetailSerializer(conv).data)