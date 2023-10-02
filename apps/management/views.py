from datetime import datetime

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.management.models import WorkOrder, ResourceItem, HelperItem
from apps.management.serializers import WorkOrderSerializer
from apps.store.models import Article
from apps.util.permissions import PlannerEditorPermission, TechnicalEditorPermission, SupervisorEditorPermission, \
    BossEditorPermission

User = get_user_model()


# Create your views here.

class WorkOrderListView(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.all().order_by('-date_start')
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            planned = request.query_params.get('planned', None)
            user = request.query_params.get('user', None)
            type_maintenance = request.query_params.get('type', None)
            physical = request.query_params.get('physical', None)
            if planned:
                if planned == 'true':
                    queryset = queryset.filter(planned=True)
                else:
                    queryset = queryset.filter(planned=False)
            if user:
                user = get_object_or_404(User, pk=user)
                queryset = queryset.filter(Q(technical=user) | Q(helpers=user)).distinct()
            if type_maintenance:
                queryset = queryset.filter(type_maintenance__id=type_maintenance)
            if physical:
                queryset = queryset.filter(asset__id=physical)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.order_by('-date_start')[:50]
            serializer = WorkOrderSerializer(queryset, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Not work orders found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([PlannerEditorPermission | TechnicalEditorPermission | BossEditorPermission])
class AddWorkOrderView(APIView):
    def post(self, request):
        try:
            if request.user.role == 'P':
                technical = request.data['technical']
            elif request.user.role == 'B':
                technical = request.data['technical']
            else:
                technical = request.user.id
            request.data['technical'] = technical
            serializer = WorkOrderSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Work order added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([PlannerEditorPermission | TechnicalEditorPermission | BossEditorPermission])
class UpdateWorkOrderView(APIView):
    def patch(self, request, pk):
        try:

            queryset = WorkOrder.objects.get(pk=pk)

            if request.user.role != "P"  and request.user not in queryset.technical.all():
                return Response({'error': 'No tiene permisos para realizar esta acción'},
                                status=status.HTTP_401_UNAUTHORIZED)
            # if (timezone.now() - queryset.date_start).total_seconds() > 24 * 60 * 60:
            #     return Response({'error': 'No se puede modificar una orden de trabajo pasadas 24 horas de su inicio'},
            #                     status=status.HTTP_401_UNAUTHORIZED)
            serializer = WorkOrderSerializer(queryset, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Work order updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([SupervisorEditorPermission])
class UpdateWorkSupervisorView(APIView):
    def patch(self, request, pk):
        try:
            queryset = WorkOrder.objects.get(pk=pk)
            queryset.supervisor = request.user
            queryset.validated = request.data['validated']
            queryset.observations = request.data['observations']
            queryset.save()
            serializer = WorkOrderSerializer(queryset, many=False)
            return Response({'message': 'Work order updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([PlannerEditorPermission | TechnicalEditorPermission | BossEditorPermission])
class DeleteWorkOrderView(APIView):
    def delete(self, request, pk):
        try:
            queryset = WorkOrder.objects.get(pk=pk)
            queryset.delete()
            return Response({'data': 'Work order deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([TechnicalEditorPermission])
class AddResourcesOTView(APIView):
    def post(self, request, pk):
        try:

            order = get_object_or_404(WorkOrder, pk=pk)
            if request.user.id != order.technical.id:
                return Response({'error': 'No tiene permisos para realizar esta acción'},
                                status=status.HTTP_401_UNAUTHORIZED)
            # if (timezone.now() - order.date_start).total_seconds() > 24 * 60 * 60:
            #     return Response(
            #         {'error': 'No se puede modificar una orden de trabajo después de 24 horas de su inicio'},
            #         status=status.HTTP_401_UNAUTHORIZED)
            article = get_object_or_404(Article, pk=request.data['article'])
            resource = ResourceItem.objects.filter(work_order=order, article=article)
            if resource.exists():
                resource = resource[0]
                resource.quantity += 1
                resource.save()
            else:
                ResourceItem.objects.create(work_order=order, article=article, quantity=1)
            return Response({'message': 'Resource added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([TechnicalEditorPermission])
class DeleteResourceOTView(APIView):
    def delete(self, request, pk):
        try:
            queryset = ResourceItem.objects.get(pk=pk)
            if request.user.id != queryset.work_order.technical.id:
                return Response({'error': 'No tiene permisos para realizar esta acción'},
                                status=status.HTTP_401_UNAUTHORIZED)
            # if (timezone.now() - queryset.work_order.date_start).total_seconds() > 24 * 60 * 60:
            #     return Response(
            #         {'error': 'No se puede modificar una orden de trabajo después de 24 horas de su inicio'},
            #         status=status.HTTP_401_UNAUTHORIZED)
            queryset.delete()
            return Response({'message': 'Resource deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([TechnicalEditorPermission])
class AddHelpersOTView(APIView):
    def post(self, request, pk):
        try:
            order = get_object_or_404(WorkOrder, pk=pk)
            if request.user.id != order.technical.id:
                return Response({'error': 'No tiene permisos para realizar esta acción'},
                                status=status.HTTP_401_UNAUTHORIZED)
            # if (timezone.now() - order.date_start).total_seconds() > 24 * 60 * 60:
            #     return Response(
            #         {'error': 'No se puede modificar una orden de trabajo después de 24 horas de su inicio'},
            #         status=status.HTTP_401_UNAUTHORIZED)
            helper = get_object_or_404(User, pk=request.data['helper'])
            date_start = request.data['date_start']
            date_finish = request.data['date_finish']
            HelperItem.objects.create(work_order=order, helper=helper, date_start=date_start, date_finish=date_finish)
            return Response({'message': 'Helper added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([TechnicalEditorPermission])
class DeleteHelperOTView(APIView):
    def delete(self, request, pk):
        try:
            queryset = HelperItem.objects.get(pk=pk)
            if request.user.id != queryset.work_order.technical.id:
                return Response({'error': 'No tiene permisos para realizar esta acción'},
                                status=status.HTTP_401_UNAUTHORIZED)
            # if (timezone.now() - queryset.work_order.date_start).total_seconds() > 24 * 60 * 60:
            #     return Response(
            #         {'error': 'No se puede modificar una orden de trabajo después de 24 horas de su inicio'},
            #         status=status.HTTP_401_UNAUTHORIZED)
            queryset.delete()
            return Response({'message': 'Helper deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
