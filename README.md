# 📘 Blog Project

A simple blog application built with Django. Users can create posts, view public posts, and interact with content in a structured and maintainable way.
## 📂 Project Structure

    blog_project/
    ├── blog_project/       # Django project settings
    │   └── celery.py       # Celery configuration
    ├── post/               # App for blog posts
    ├── templates/          # HTML templates
    ├── static/             # CSS/JS files (if any)
    ├── manage.py
    ├── requirements.txt

---

## 🚀 Features


- 📝 Interns can create and list posts via web interface  
- ⏰ If no post is created within 10 minutes, a warning notification is sent automatically (via Celery)  
- 👤 User authentication system (login/logout/register)  
- 🌐 Public post viewing for all visitors  
- 🛠 Admin panel for managing users and posts  
- 📧 Background email notifications using Celery + Redis + Celery Beat


---

## 🧰 Tech Stack

- **Backend**: Django (Python)  
- **Task Queue**: Celery + Redis  
- **Frontend**: HTML, CSS (via Django Templates)  
- **Other Tools**: Git, GitHub, Postman

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repo

```bash
git clone https://github.com/a1eynayildiz/blog_project.git
cd blog_project
```

### 🔹 2. Create and Activate Virtual Environment
```bash
python -m venv venv
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate

```

### 🔹 3. Install Requirements
```bash
pip install -r requirements.txt
```
### 🔹 4. Apply Migrations
```bash
python manage.py migrate
python manage.py runserver
```

## 📨 Celery Setup (for Background Task Processing)

### 🔹 1. Install & Run Redis

> Redis is used as the message broker.

**On Windows:**  
Use Redis via [Memurai](https://www.memurai.com/) or [Redis for Windows](https://github.com/microsoftarchive/redis/releases).

**On Linux/macOS:**

```bash
sudo apt update
sudo apt install redis-server
```
### To start Redis:
```
bash
redis-server
````

🔹 2. Start Celery Worker
In the project root directory (where manage.py is):
```
bash

celery -A blog_project worker --loglevel=info
```


### settings.py
```python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
```
Also, ensure you have a celery.py file in your main project folder and that it's imported in __init__.py:


### blog_project/celery.py
```
python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')

app = Celery('blog_project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### blog_project/__init__.py
````
python
from __future__ import absolute_import, unicode_literals
from .celery import app as celery_app

__all__ = ['celery_app']

````
## 🌐 Uygulama URL’leri ve Açıklamaları (REST + Template)

| Adres | Açıklama |
|-------|----------|
| `http://127.0.0.1:8000/` | Ana sayfa (yönlendirme yapar) |
| `http://127.0.0.1:8000/posts/` | Tüm gönderileri (post) listeler |
| `http://127.0.0.1:8000/posts/create/` | Yeni post oluşturma sayfası (yalnızca giriş yapmış kullanıcılar erişebilir) |
| `http://127.0.0.1:8000/posts/no-posts/` | Son 10 dakikada post atmayan stajyerleri listeler |
| `http://127.0.0.1:8000/posts/login/` | Giriş (login) sayfası (admin veya stajyer) |
| `http://127.0.0.1:8000/posts/logout/` | Çıkış sayfası (logout) |

---

## 🔁 REST API URL’leri (DRF + Token)

| Adres | Açıklama |
|-------|----------|
| `http://127.0.0.1:8000/posts/api/` | API ana dizini (auth gerektirir) |
| `http://127.0.0.1:8000/posts/api/posts/` | Giriş yapan kişi tüm postları görüntüler. |
| `http://127.0.0.1:8000/posts/api/posts/<id>/` | Belirli bir post detayına ulaşım ve güncelleme/silme işlemleri |
| `http://127.0.0.1:8000/posts/api/users/` | Kullanıcı listesi |
| `http://127.0.0.1:8000/posts/api/token/` | Token alma endpoint’i (`POST` ile username + password gönderilir) |
| `http://127.0.0.1:8000/posts/api/posts-list/` | Eski API: Tüm postları listeler veya oluşturur (kısıtlı) |










