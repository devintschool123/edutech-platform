from django.contrib import admin

from .models import Course, Lesson # Import the Course model

# Register your models here.
admin.site.register(Course)
admin.site.register(Lesson)
