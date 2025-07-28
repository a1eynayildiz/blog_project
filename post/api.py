from rest_framework import viewsets, serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET', 'POST'])
def post_list_api(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # user alanı zorunluysa
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrReadOnly]



#DRF router ile erişilen API
class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
        return Post.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # 👈 Admin de post atabilir



