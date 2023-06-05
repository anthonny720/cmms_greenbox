from django.urls import path

from .views import GetQuantityOTPersonnel, GetTotalOT, \
    GetIndicatorView, GetCostDay, GetTotalCostView, GetTableOTView, GetGraphics

app_name = "graphics"

urlpatterns = [
    path('get-graphics-personnel', GetQuantityOTPersonnel.as_view(), name='get-graphics-personnel'),
    path('ot', GetGraphics.as_view(), name='get-graphics-failure'),

    path('get-graphics-total-ot', GetTotalOT.as_view(), name='get-graphics-total-ot'),
    path('get-graphics-indicators', GetIndicatorView.as_view(), name='get-graphics-indicator'),
    path('get-graphics-cost-day', GetCostDay.as_view(), name='get-graphics-cost-day'),
    path('get-graphics-total-cost', GetTotalCostView.as_view(), name='get-graphics-total-cost'),
    path('get-total-ot', GetTableOTView.as_view(), name='get-total-ot'),
]
