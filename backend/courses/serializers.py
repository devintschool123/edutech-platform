# backend/courses/serializers.py

from rest_framework import serializers
from .models import Course, Lesson # Make sure Lesson is imported

# --- DEFINE LESSON SERIALIZER FIRST ---
# We define this first, so it's available for the CourseSerializer to use.
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order']


# --- DEFINE COURSE SERIALIZER SECOND ---
# Now, when Python reaches this point, it knows what LessonSerializer is.
class CourseSerializer(serializers.ModelSerializer):
    # This field uses the LessonSerializer we defined above.
    lessons = LessonSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Course
        # Add 'lessons' to the list of fields to include in the API output.
        fields = ['id', 'title', 'description', 'owner', 'created_at', 'updated_at', 'lessons']

