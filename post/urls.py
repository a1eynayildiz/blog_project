# post/urls.py
from django.urls import path
from .views import post_list
from .views import post_create
from django.contrib.auth import views as auth_views
from .models import Post
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('create/', views.post_create, name='post_create'),
    path('no-posts/', views.no_posts, name='no_posts'),

]
