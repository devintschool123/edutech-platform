# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include

# --- THE FIX ---
# 1. We ONLY import your custom view from the users app.
from users.views import MyTokenObtainPairView

# 2. We ONLY import the RefreshView from the library, since we don't need its TokenObtainPairView anymore.
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API URLs from your apps
    path('api/', include('courses.urls')),
    path('api/user/', include('users.urls')),

    # JWT Authentication URLs
    # 3. We explicitly use YOUR custom view here, which adds the username to the token.
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # The refresh view can remain the default one from the library.
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
