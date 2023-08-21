import os
from datetime import datetime

import gdown as gdown
import pandas as pd
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.store.models import Article, Requirements
from apps.store.serializers import StoreSerializer, RequirementsSerializer
from apps.util.permissions import BossEditorPermission, PlannerEditorPermission, TechnicalEditorPermission, OperatorEditorPermission, ShoppingEditorPermission


# Create your views here.

class SyncStoreView(APIView):
    def get(self, request, format=None):

        # Descargar el archivo usando gdown
        url = 'https://drive.google.com/uc?id=1lD8D9t1LlJsf8HSAuMSRWGR7UcnbvlQn'
        output = 'temp_file.xlsx'
        gdown.download(url, output, quiet=False)

        try:
            # Leer el archivo descargado con pandas
            df = pd.read_excel(output, dtype=str, engine='openpyxl', skiprows=2, sheet_name='STOCK GENERAL')
            df.fillna(0, inplace=True)

            # Eliminar los registros existentes en el modelo antes de agregar los nuevos
            Article.objects.all().delete()

            # Recorrer el DataFrame y agregar cada registro a la base de datos
            for _, row in df.iterrows():
                costo_unitario = row['COSTO UNITARIO']
                if costo_unitario == '':
                    costo_unitario = 0
                else:
                    try:
                        costo_unitario = float(costo_unitario)
                    except ValueError:
                        costo_unitario = 0  # Si la conversión falla, establecer en cero
                stock_value = row['STOCK ']
                if stock_value == '':
                    stock_value = 0
                else:
                    stock_value = int(round(float(stock_value)))  # Redondear y convertir a entero
                obj = Article(
                    group=row['GRUPO'],
                    code_sap=row['CODIGO'],
                    description=row['DESCRIPCION'],
                    unit_measurement=row['UND'],
                    value=costo_unitario,
                    stock=stock_value,
                )
                obj.save()

            # Borrar el archivo temporal
            os.remove(output)

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListStoreView(APIView):
    def get(self, request):
        try:
            queryset = Article.objects.all()
            description = request.query_params.get('name', None)
            if description:
                queryset = queryset.filter(description__icontains=description)
            serializer = StoreSerializer(queryset.exclude(group__icontains='0')[:20], many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'No articles found'}, status=status.HTTP_200_OK)


class ListRequirementsView(APIView):
    def get(self, request):
        try:
            queryset = Requirements.objects.all()
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            if date_start and date_end:
                queryset = queryset.filter(date__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                        datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(date__month=datetime.now().month)
            serializer = RequirementsSerializer(queryset, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No requirements found', 'detail': str(e)}, status=status.HTTP_200_OK)


@permission_classes(
    [BossEditorPermission | PlannerEditorPermission | TechnicalEditorPermission | OperatorEditorPermission])
class AddRequirementsView(APIView):
    def post(self, request):
        try:
            data = request.data
            data['user'] = request.user.id
            serializer = RequirementsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Requirements added'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([
    BossEditorPermission | PlannerEditorPermission | TechnicalEditorPermission | OperatorEditorPermission | ShoppingEditorPermission])
class UpdateRequirementsView(APIView):
    def patch(self, request, id):
        try:
            queryset = Requirements.objects.get(id=id)
            serializer = RequirementsSerializer(queryset, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Requirements updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes(
    [BossEditorPermission | PlannerEditorPermission])
class DeleteRequirementsView(APIView):
    def delete(self, request, id):
        try:
            queryset = Requirements.objects.get(id=id)
            queryset.delete()
            return Response({'message': 'Requirements deleted'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
