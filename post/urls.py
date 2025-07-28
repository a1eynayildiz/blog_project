from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import post_list, post_create, no_posts
from .api import UserViewSet, PostViewSet, post_list_api
from django.contrib.auth import views as auth_views

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('', post_list, name='post_list'),
    path('create/', post_create, name='post_create'),
    path('no-posts/', no_posts, name='no_posts'),
    path('api/posts-list/', post_list_api, name='post_list_api'),
    path('api/', include(router.urls)),
    path('api/token/', obtain_auth_token, name='api_token_auth'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('api/auth/login/', obtain_auth_token, name='api-login'),

]
    
