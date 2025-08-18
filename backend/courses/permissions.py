# backend/courses/permissions.py

from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Read-only access is allowed for any request.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the course.
        # 'obj' is the course object being accessed.
        return obj.owner == request.user

class IsCourseOwner(permissions.BasePermission):
    """
    Custom permission to only allow the owner of a course to edit its lessons.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the parent course.
        # 'obj' is the Lesson instance here.
        return obj.course.owner == request.user