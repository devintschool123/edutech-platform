# backend/courses/models.py

from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    owner = models.ForeignKey(User, related_name='courses', on_delete=models.CASCADE) # <-- ADD THIS LINE
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order'] # Ensures lessons are ordered correctly by default

    def __str__(self):
        return f"{self.course.title} - Lesson {self.order}: {self.title}"
