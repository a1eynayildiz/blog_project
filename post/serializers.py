from rest_framework import serializers
from .models import Post
# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # 👈 Author bilgisini nested olarak ekleyin
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at']