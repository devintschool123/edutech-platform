# backend/courses/serializers.py

from rest_framework import serializers
from .models import Course, Lesson, Enrollment

# --- DEFINE LESSON SERIALIZER FIRST ---
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        # THE FIX: We add 'course' to this list. This tells the serializer to 
        # accept a course ID when creating/updating a lesson.
        fields = ['id', 'course', 'title', 'content', 'order']

class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Enrollment model.
    The student is automatically set to the current user.
    """
    # We set the student field to be read-only because we will set it
    # automatically in the view based on the authenticated user.
    student = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'enrolled_at']

# --- DEFINE COURSE SERIALIZER SECOND ---
class CourseSerializer(serializers.ModelSerializer):
    # This field uses the LessonSerializer we just defined.
    # It remains 'read_only' here because we don't manage lessons
    # through the course endpoint.
    lessons = LessonSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'owner', 'created_at', 'updated_at', 'lessons']
