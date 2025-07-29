from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from post.models import Post, NoPostRecord  # NoPostRecord modelini dahil ettik
from celery import shared_task
import datetime

@shared_task
def test_task():
    try:
        now = timezone.now()
        ten_minutes_ago = now - datetime.timedelta(minutes=10)
        User = get_user_model()
        
        # Eski kayıtları temizle
        NoPostRecord.objects.all().delete()

        for user in User.objects.all():
            if not Post.objects.filter(user=user, created_at__range=(ten_minutes_ago, now)).exists():
                # Veritabanına kayıt
                NoPostRecord.objects.create(user=user)
                
                # E-posta gönder
                if user.email:
                    try:
                        send_mail(
                            subject="10 Dakikalık Post Uyarısı",
                            message="Son 10 dakikada post atmadınız.",
                            from_email=None,  # DEFAULT_FROM_EMAIL kullanır
                            recipient_list=[user.email],
                            fail_silently=False,  # Hataları göster
                        )
                        print(f"Mail gönderildi: {user.email}")  # Log
                    except Exception as e:
                        print(f"Mail gönderilemedi {user.email}: {str(e)}")
                        
        return "Görev başarıyla tamamlandı"
    except Exception as e:
        return f"Hata oluştu: {str(e)}"