# blog_project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from post import views as post_views
from django.shortcuts import redirect

urlpatterns = [
    path('posts/', include('post.urls')),
    path('admin/', admin.site.urls),
    path('posts/', include('post.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('', lambda request: redirect('post_list')), 
]

  


