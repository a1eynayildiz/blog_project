from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from post.models import Post, NoPostRecord  # NoPostRecord modelini dahil ettik
from celery import shared_task
import datetime

@shared_task
def test_task():
    now = timezone.now()
    ten_minutes_ago = now - datetime.timedelta(minutes=10)
    User = get_user_model()
    all_users = User.objects.all()
    warned = []

    # Eski kayıtları temizle (her çalıştığında yeniden oluşturulacak)
    NoPostRecord.objects.all().delete()

    for user in all_users:
        has_posted = Post.objects.filter(
            user=user,
            created_at__gte=ten_minutes_ago,
            created_at__lte=now
        ).exists()

        if not has_posted:
            warned.append(user.username)

            # ✅ Mail gönder
            if user.email:
                send_mail(
                    subject="10 Dakikalık Post Uyarısı",
                    message="Son 10 dakikada post atmadınız.",
                    from_email="ay3727096@gmail.com",
                    recipient_list=[user.email],
                    fail_silently=True,
                )

            # ✅ Veritabanına kayıt
            NoPostRecord.objects.create(user=user)

    return f"Uyarılan kullanıcılar: {warned}"
