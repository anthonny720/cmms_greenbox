from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.config.models import Failure, Type
from apps.config.serializers import FailureSerializer, TypeSerializer
from apps.users.models import UserCategory
from apps.users.serializers import UserCategorySerializer
from apps.util.permissions import BossEditorPermission, PlannerEditorPermission, IsAdmin


# Create your views here.

class ListFailureView(APIView):
    def get(self, request):
        try:
            failures = Failure.objects.all()
            serializer = FailureSerializer(failures, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No failures found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListTypeView(APIView):
    def get(self, request):
        try:
            types = Type.objects.all()
            serializer = FailureSerializer(types, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No types found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class AddFailureView(APIView):
    def post(self, request):

        try:
            serializer = FailureSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Failure added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class AddTypeView(APIView):
    def post(self, request):
        try:
            serializer = TypeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Type added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class UpdateFailureView(APIView):
    def patch(self, request, pk):
        try:
            failure = Failure.objects.get(pk=pk)
            serializer = FailureSerializer(failure, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Failure updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class UpdateTypeView(APIView):
    def patch(self, request, pk):
        try:
            type = Type.objects.get(pk=pk)
            serializer = TypeSerializer(type, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Type updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class DeleteFailureView(APIView):
    def delete(self, request, pk):
        try:
            failure = Failure.objects.get(pk=pk)
            failure.delete()
            return Response({'message': 'Failure deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class DeleteTypeView(APIView):
    def delete(self, request, pk):
        try:
            type = Type.objects.get(pk=pk)
            type.delete()
            return Response({'message': 'Type deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCategoryView(APIView):
    def get(self, request):
        try:
            category = UserCategory.objects.all()
            serializer = UserCategorySerializer(category, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No categories found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class AddCategoryView(APIView):
    def post(self, request):
        try:
            serializer = UserCategorySerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Category added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class UpdateCategoryView(APIView):
    def patch(self, request, pk):
        try:
            category = UserCategory.objects.get(pk=pk)
            serializer = UserCategorySerializer(category, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Category updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@permission_classes([BossEditorPermission | PlannerEditorPermission | IsAdmin])
class DeleteCategoryView(APIView):
    def delete(self, request, pk):
        try:
            category = UserCategory.objects.get(pk=pk)
            category.delete()
            return Response({'message': 'Category deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
