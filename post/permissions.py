# post/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Stajyerler sadece kendi postlarını görebilir/yazabilir.
    Admin tüm postları görebilir ama yazamaz.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return request.method in permissions.SAFE_METHODS  # sadece GET, HEAD, OPTIONS
        return obj.user == request.user