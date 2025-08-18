# backend/courses/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet
from . import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')

router.register(r'my-courses', views.MyCoursesViewSet, basename='my-courses')
router.register(r'enrollments', views.EnrollmentViewSet)
router.register(r'my-enrollments', views.MyEnrollmentsViewSet, basename='my-enrollments')


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
