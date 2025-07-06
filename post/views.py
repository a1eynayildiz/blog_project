from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .models import Post, NoPostRecord

# 🌐 POST LİST TEMPLATE
def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'post_list.html', {'posts': posts})

# 🌐 POST CREATE TEMPLATE
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

# 🌐 10 DAKİKADA POST ATMAYANLAR SAYFASI
def no_posts(request):
    users = NoPostRecord.objects.select_related('user').all().order_by('-checked_at')
    return render(request, 'no_posts.html', {'records': users})
