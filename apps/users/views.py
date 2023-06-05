# Create your views here.
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from djoser.views import UserViewSet
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import UserCategory, ThirdParties
from apps.users.serializers import ThirdPartiesSerializer
from apps.util.permissions import IsAdmin, PlannerEditorPermission, BossEditorPermission

User = get_user_model()


# Create your views here.
@permission_classes([IsAdmin])
class DeleteUserView(APIView):
    def delete(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=kwargs['id'])
        except:
            return Response({'error': 'Not user found'}, status=status.HTTP_404_NOT_FOUND)
        if user.id == request.user.id:
            return Response({'error': 'Incorrect request, try again!'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            name = user.first_name
            user.delete()
            return Response({'message': 'User {} deleted'.format(name)}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Error deleting user'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class UpdateUserView(APIView):
    def patch(self, request, *args, **kwargs):

        try:
            user = User.objects.get(id=kwargs['id'])
        except:
            return Response({'error': 'Not user found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            category = UserCategory.objects.get(id=request.data['category'])
        except:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        try:
            user.first_name = request.data['first_name']
            user.last_name = request.data['last_name']
            user.last_name = request.data['last_name']
            user.address = request.data['address']
            user.phone = request.data['phone']
            user.dni = request.data['dni']
            user.category = category
            user.role = request.data['role']
            if request.data['password'] and request.data['password'] != "":
                user.set_password(request.data['password'])
            user.save()
            serializer = UserSerializer(user)
            return Response({'message': 'User updated'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Error updating user'}, status=status.HTTP_400_BAD_REQUEST)


class CustomUserViewSet(UserViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class ListThirdPartiesView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            third_parties = ThirdParties.objects.all()
            serializer = ThirdPartiesSerializer(third_parties, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Not found third parties'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class AddThirdPartiesView(APIView):
    def post(self, request):
        try:
            serializer = ThirdPartiesSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Third parties added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': 'Error adding third parties'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class UpdateThirdPartiesView(APIView):
    def patch(self, request, pk):
        try:
            third_parties = ThirdParties.objects.get(id=pk)
            serializer = ThirdPartiesSerializer(instance=third_parties, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Third parties updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error updating third parties'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class DeleteThirdPartiesView(APIView):
    def delete(self, request, pk):
        try:
            third_parties = ThirdParties.objects.get(id=pk)
            third_parties.delete()
            return Response({'message': 'Third parties deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Error deleting third parties'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
