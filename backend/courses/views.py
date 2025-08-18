# backend/courses/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer
# Import both of your custom permission classes
from .permissions import IsOwnerOrReadOnly, IsCourseOwner 
from rest_framework import viewsets, status # <-- IMPORT status
from rest_framework.response import Response # <-- IMPORT Response
from .models import Course, Lesson, Enrollment # <-- IMPORT Enrollment
from .serializers import CourseSerializer, LessonSerializer, EnrollmentSerializer # <-- IMPORT EnrollmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows courses to be viewed or edited.
    """
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer
    # This ViewSet correctly uses IsOwnerOrReadOnly for the Course model
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        """Sets the user who is making the request as the owner of the course."""
        serializer.save(owner=self.request.user)

class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lessons to be viewed or edited.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    # THE FIX: This now uses the IsCourseOwner permission, which checks
    # if the user owns the parent course, not the lesson itself.
    permission_classes = [IsCourseOwner]


class MyCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    It only returns the courses owned by the currently authenticated user.
    """
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users can see this

    def get_queryset(self):
        """
        This view should return a list of all the courses
        for the currently authenticated user.
        """
        user = self.request.user
        return Course.objects.filter(owner=user).order_by('-created_at')
    
class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creating and managing course enrollments.
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated] # Only logged-in users can enroll

    def perform_create(self, serializer):
        """
        Overrides the default create behavior to set the student
        to the currently authenticated user.
        """
        # Check if the user is already enrolled
        course = serializer.validated_data['course']
        if Enrollment.objects.filter(student=self.request.user, course=course).exists():
            # We can't raise a validation error here in perform_create,
            # so we handle this in the create method instead. This part is for safety.
            return 

        serializer.save(student=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Custom create method to prevent duplicate enrollments.
        """
        course_id = request.data.get('course')
        if Enrollment.objects.filter(student=request.user, course_id=course_id).exists():
            return Response(
                {'detail': 'You are already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
    

class MyEnrollmentsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset returns a list of all the enrollments
    for the currently authenticated user.
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Enrollment.objects.filter(student=user)