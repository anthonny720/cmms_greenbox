from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response

UserAccount = get_user_model()


class TechnicalEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.TECHNICAL and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class OperatorEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.OPERATOR and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class SupervisorEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.SUPERVISOR and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class ShoppingEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.SHOPPING and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class PlannerEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.PLANNER and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class BossEditorPermission(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        else:
            return request.user.is_authenticated and request.user.role == UserAccount.RolesChoices.BOSS and request.user.permissions == UserAccount.PermissionsChoices.EDITOR

    def handle_no_permission(self, request):
        return Response({'error': self.message}, status=status.HTTP_403_FORBIDDEN)


class IsAdmin(BasePermission):
    message = "No tiene permisos para realizar esta acción"

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser
