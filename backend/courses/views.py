# backend/courses/views.py

from rest_framework import viewsets
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
from .permissions import IsOwnerOrReadOnly # <-- THE FIX: Corrected import name

class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows courses to be viewed or edited.
    """
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer
    permission_classes = [IsOwnerOrReadOnly] # Use our custom ownership permission

    def perform_create(self, serializer):
        """Sets the user who is making the request as the owner of the course."""
        serializer.save(owner=self.request.user)

class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lessons to be viewed or edited.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    # Apply the same ownership permission to lessons for security consistency
    permission_classes = [IsOwnerOrReadOnly]
