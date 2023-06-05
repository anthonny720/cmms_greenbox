import math
import random
from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.assets.models import Physical, Fixed
from apps.config.models import Failure, Type
from apps.management.models import WorkOrder
from apps.management.serializers import WorkOrderSerializer

# Create your views here.
User = get_user_model()


def generate_color(transparency=1):
    blue_palette = [
        (176, 224, 230),
        (135, 206, 235),
        (70, 130, 180),
        (0, 191, 255),
        (30, 144, 255),
        (65, 105, 225),
        (0, 0, 255),
        (0, 0, 205),
        (0, 0, 139),
        (25, 25, 112)
    ]
    green_palette = [
        (189, 252, 201),
        (144, 238, 144),
        (0, 255, 127),
        (0, 250, 154),
        (0, 128, 0),
        (50, 205, 50),
        (34, 139, 34),
        (0, 100, 0),
        (0, 255, 0),
        (0, 128, 128)
    ]
    rand_blue = random.choice(blue_palette)
    rand_green = random.choice(green_palette)
    rand_color = (rand_blue[0], rand_green[1], rand_blue[2])
    color_full = "rgba({}, {}, {}, {})".format(rand_color[0], rand_color[1], rand_color[2], transparency)
    return color_full


class GetQuantityOTPersonnel(APIView):
    def get(self, request, *args, **kwargs):
        try:
            queryset = WorkOrder.objects.filter(status=True).order_by('date_start')

            date_start = request.query_params.get('date_start')
            date_end = request.query_params.get('date_end')
            planned = request.query_params.get('planned')

            if planned:
                if planned == 'true':
                    queryset = queryset.filter(planned=True)
                else:
                    queryset = queryset.filter(planned=False)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(
                    date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])

            users = User.objects.filter(Q(role='T') | Q(role='O'), is_active=True)

            count_total_ot = []
            total_hours = []
            days = []
            range_date = set(q.date_start.date() for q in queryset.order_by('date_start'))

            for u in users:
                query = queryset.filter(Q(technical=u) | Q(helpers=u))

                result = query.count()
                count_total_ot.append({
                    'label': u.get_full_name(),
                    'data': [result],
                    'backgroundColor': generate_color()
                })

                hours = sum(q.get_time().total_seconds() for q in query if q.technical == u)
                hours += sum(i.get_time().total_seconds() for q in query for i in q.helpers_order.all() if i.helper == u)

                total_hours.append({
                    'label': f"{u.get_full_name()} {str(timedelta(seconds=hours)).split('.')[0]} hrs",
                    'data': hours / 3600,
                    'backgroundColor': generate_color()
                })

                days_personnel = []
                for d in range_date:
                    query = queryset.filter(date_start__date=d).order_by('date_start')

                    hours = sum(q.get_time().total_seconds() for q in query if q.technical == u)
                    hours += sum(
                        i.get_time().total_seconds() for q in query for i in q.helpers_order.all() if i.helper == u)

                    days_personnel.append({
                        'label': d.strftime('%d/%m/%Y'),
                        'data': str(timedelta(seconds=hours))
                    })

                days.append({'label': u.get_full_name(), 'data': days_personnel})

            return Response({
                'count_total_ot': count_total_ot,
                'total_hours': total_hours,
                'days': days
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetGraphics(APIView):
    def get_queryset(self, planned, date_start, date_end):
        queryset = WorkOrder.objects.filter(status=True)

        if planned:
            if planned == 'true':
                queryset = queryset.filter(planned=True)
            else:
                queryset = queryset.filter(planned=False)
        if date_start and date_end:
            queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                          datetime.strptime(date_end, "%d/%m/%Y")])
        else:
            queryset = queryset.filter(
                date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])
        return queryset

    def get(self, request):
        try:
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            planned = request.query_params.get('planned', None)
            total = self.get_queryset(planned, date_start, date_end).count()

            # Count by Failure
            count_failure = []
            for failure in Failure.objects.all():
                query = self.get_queryset(planned, date_start, date_end).filter(failure=failure)
                cost = sum(float(q.get_cost()) for q in query)
                if query.count() > 0:
                    percentage = round(query.count() * 100 / total, 2)
                    count_failure.append({'label': f'{failure.name} - {percentage}%', 'data': query.count(),
                                          'backgroundColor': generate_color(), 'cost': cost})

            # Count by Type
            count_type = []
            for maintenance_type in Type.objects.all():
                query = self.get_queryset(planned, date_start, date_end).filter(type_maintenance=maintenance_type)
                cost = sum(float(q.get_cost()) for q in query)
                if query.count() > 0:
                    percentage = round(query.count() * 100 / total, 2)
                    count_type.append({'label': f'{maintenance_type.name} - {percentage}%', 'data': query.count(),
                                       'backgroundColor': generate_color(), 'cost': cost})

            # Count by Equipment
            count_equipment = []
            for equipment in Physical.objects.all():
                query = self.get_queryset(planned, date_start, date_end).filter(asset=equipment)
                cost = sum(float(q.get_cost()) for q in query)
                if query.count() > 0:
                    percentage = round(query.count() * 100 / total, 2)
                    count_equipment.append({'label': f'{equipment.name} - {percentage}%', 'data': query.count(),
                                            'backgroundColor': generate_color(), 'cost': cost})

            # Count by Facilities
            count_facilities = []
            for facility in Fixed.objects.all():
                for physical in facility.physicals.all():
                    query = self.get_queryset(planned, date_start, date_end).filter(asset=physical)
                    cost = sum(float(q.get_cost()) for q in query)
                    if query.count() > 0:
                        percentage = round(query.count() * 100 / total, 2)
                        count_facilities.append({'label': f'{facility.name} - {percentage}%', 'data': query.count(),
                                                 'backgroundColor': generate_color(), 'cost': cost})

            return Response({'count_failure': count_failure, 'count_type': count_type,
                             'count_equipment': count_equipment, 'count_facilities': count_facilities},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTotalOT(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.filter()
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            planned = request.query_params.get('planned', False)

            if planned:
                if planned == 'true':
                    queryset = queryset.filter(planned=True)
                else:
                    queryset = queryset.filter(planned=False)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(
                    date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])

            finished = queryset.filter(status=True).count()
            pending = queryset.filter(status=False).count()
            total = finished + pending
            compliance = round(finished * 100 / total, 2)
            return Response({'finished': finished, 'pending': pending, 'compliance': compliance},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetIndicatorView(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.filter(type_maintenance__name='Correctivo')
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(
                    date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])

            data = []
            for p in Physical.objects.filter(criticality='H'):
                query = queryset.filter(asset=p)
                if query.count() > 0:
                    total = 0
                    query = query.order_by('date_report')
                    fallas_dt = [datetime.strptime(str(f.date_report), '%Y-%m-%d %H:%M:%S') for f in query]
                    deltas = [fallas_dt[i + 1] - fallas_dt[i] for i in range(len(fallas_dt) - 1)]

                    mtbf = sum(deltas, timedelta(0)) / len(deltas) if len(deltas) > 0 else timedelta(0)
                    text = str(mtbf)
                    mtbf = round(mtbf.total_seconds() / 3600, 2)
                    count = query.filter(status=True).count()
                    for f in query.filter(status=True):
                        total += f.get_time().total_seconds()
                    mttr = total / count if count > 0 else 0
                    text2 = str(timedelta(seconds=mttr))
                    mttr = round(mttr / 3600, 2)

                    available = round((mtbf - mttr) / mtbf * 100, 2) if mtbf > 0 else 0
                    execute = mtbf - mttr
                    reliability = round(math.exp(-execute / mtbf) if mtbf > 0 else 0, 2)

                    data.append({'label_mttr': p.name + " - " + text2 + " hrs", 'data_mttr': mttr,
                                 'label_mtbf': p.name + " - " + text + " hrs", 'data_mtbf': mtbf,
                                 'backgroundColor': generate_color(),
                                 'label_available': p.name + " - " + str(available) + "%", 'data_available': available,
                                 'label_reliability': p.name + " - " + str(reliability),
                                 'data_reliability': reliability})
            return Response({'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetCostDay(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.filter(status=True)
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            planned = request.query_params.get('planned', None)
            range_date = []
            data = []
            if planned:
                if planned == 'true':
                    queryset = queryset.filter(planned=True)
                else:
                    queryset = queryset.filter(planned=False)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(
                    date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])
            for q in queryset.order_by('date_start'):
                if q.date_start.date() not in range_date:
                    range_date.append(q.date_start.date())
            for r in range_date:
                query = queryset.filter(date_start__date=r)
                total = 0
                result = []
                for q in query:
                    total += q.get_cost()

                result.append(total)
                data.append({'label': r, 'data': result, 'backgroundColor': generate_color()})
            return Response({'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTotalCostView(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.filter(status=True)
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            planned = request.query_params.get('planned')
            if planned:
                if planned == 'true':
                    queryset = queryset.filter(planned=True)
                else:
                    queryset = queryset.filter(planned=False)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(
                    date_start__range=[datetime.now().date() - timedelta(days=7), datetime.now().date()])
            user = 0
            material = 0
            for q in queryset:
                user += float(q.get_cost_personnel())
                material += float(q.get_cost())
            resource = round(float(material) - float(user), 2)
            return Response({'user': user, 'material': resource}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTableOTView(APIView):
    def get(self, request):
        try:
            queryset = WorkOrder.objects.filter(status=True)
            date_start = request.query_params.get('date_start', None)
            date_end = request.query_params.get('date_end', None)
            if date_start and date_end:
                queryset = queryset.filter(date_start__range=[datetime.strptime(date_start, "%d/%m/%Y"),
                                                              datetime.strptime(date_end, "%d/%m/%Y")])
            else:
                queryset = queryset.filter(date_start__month=datetime.now().month)

            queryset = queryset.order_by('date_start')
            serializer = WorkOrderSerializer(queryset, many=True)

            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'No work orders pending found', 'detail': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
