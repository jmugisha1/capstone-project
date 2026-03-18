from django.db import models
from django.conf import settings


class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations")
    title = models.CharField(max_length=255, default="New Consultation")
    symptoms = models.TextField(default="")
    initial_predictions = models.JSONField(default=list)
    questions_answers = models.JSONField(default=list)  # [{ question, answer }]
    final_predictions = models.JSONField(default=list)
    specialist = models.CharField(max_length=255, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.user.email}"