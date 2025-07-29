# views.py - mevcut kodlarınız + yeni authentication fonksiyonları
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .models import Post, NoPostRecord

# REST Framework imports (yeni eklenenler)
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

# ========= MEVCUT TEMPLATE VIEW'LARINIZ =========

#  POST LİST TEMPLATE
def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'post_list.html', {'posts': posts})

#  POST CREATE TEMPLATE
@login_required
def post_create(request):
    users = User.objects.all()
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        selected_user_id = request.POST.get('user')
        selected_user = User.objects.get(id=selected_user_id)

        if title and content and selected_user:
            Post.objects.create(
                title=title,
                content=content,
                user=selected_user
            )
            return redirect('post_list')

    return render(request, 'post_create.html', {'users': users})

#  10 DAKİKADA POST ATMAYANLAR SAYFASI
def no_posts(request):
    users = NoPostRecord.objects.select_related('user').all().order_by('-checked_at')
    return render(request, 'no_posts.html', {'records': users})

# ========= YENİ API AUTHENTICATION FONKSIYONLARI =========

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username ve password gerekli'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user:
        if user.is_active:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Hesap devre dışı'
            }, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({
            'error': 'Kullanıcı adı veya şifre hatalı'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    
    if not username or not password:
        return Response({
            'error': 'Username ve password gerekli'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Bu kullanıcı adı zaten alınmış'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': f'Kayıt hatası: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def logout_user(request):
    try:
        # Token'ı sil
        token = Token.objects.get(user=request.user)
        token.delete()
        return Response({
            'message': 'Çıkış başarılı'
        }, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({
            'message': 'Çıkış başarılı'
        }, status=status.HTTP_200_OK)