from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Django ayarlarını Celery'e tanıt
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')

# Celery uygulamasını oluştur
app = Celery('blog_project')

# Django ayarlarından Celery ayarlarını al
app.config_from_object('django.conf:settings', namespace='CELERY')

# Tüm uygulamalardaki tasks.py dosyalarını otomatik bulur
app.autodiscover_tasks()

# Opsiyonel: Zaman dilimi ayarı (isteğe bağlı)
# app.conf.timezone = 'Europe/Istanbul'
# app.conf.enable_utc = False
