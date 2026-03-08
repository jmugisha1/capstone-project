from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationListSerializer, ConversationDetailSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    search = request.query_params.get("search", "")
    conversations = Conversation.objects.filter(user=request.user)
    if search:
        conversations = conversations.filter(title__icontains=search)
    serializer = ConversationListSerializer(conversations, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    conversation = Conversation.objects.create(user=request.user)
    # Set initial title with user name + ID
    name_parts = request.user.full_name.split()[:2]
    short_name = " ".join(name_parts) if name_parts else "User"
    conversation.title = f"{short_name} — Consultation #{conversation.id}"
    conversation.save()
    serializer = ConversationListSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation_detail(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ConversationDetailSerializer(conversation)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_conversation_title(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    title = request.data.get("title", "")
    if title:
        conversation.title = title[:255]
        conversation.save()
    serializer = ConversationListSerializer(conversation)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk, user=request.user)
    except Conversation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    content = request.data.get("content", "")
    role = request.data.get("role", "user")

    if not content:
        return Response({"error": "content required"}, status=status.HTTP_400_BAD_REQUEST)

    if role not in ["user", "assistant"]:
        return Response({"error": "invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    Message.objects.create(conversation=conversation, role=role, content=content)

    return Response({"status": "saved"}, status=status.HTTP_201_CREATED)