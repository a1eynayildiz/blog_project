# post/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Herkes kendi postlarını oluşturabilir ve düzenleyebilir.
    Admin tüm postları görebilir ve düzenleyebilir.
    """
    
    def has_permission(self, request, view):
        # Authenticated kullanıcılar tüm işlemleri yapabilir
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin kullanıcıları her şeyi yapabilir
        if request.user.is_staff:
            return True
        
        # Normal kullanıcılar sadece kendi postlarına erişebilir
        return obj.user == request.user

# Alternatif: Daha spesifik permission sınıfı
class IsOwnerOrAdminReadOnly(permissions.BasePermission):
    """
    Kullanıcılar kendi postlarını oluşturabilir ve düzenleyebilir.
    Admin tüm postları görebilir ama düzenleyemez.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin sadece okuma işlemleri yapabilir
        if request.user.is_staff:
            return request.method in permissions.SAFE_METHODS
        
        # Normal kullanıcılar sadece kendi postlarına erişebilir
        return obj.user == request.user