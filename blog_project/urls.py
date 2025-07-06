# blog_project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from post import views as post_views
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('post_create')), 
    path('admin/', admin.site.urls),
    path('posts/', include('post.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
  
]


