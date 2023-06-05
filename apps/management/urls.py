from django.urls import path

from .views import AddWorkOrderView, UpdateWorkOrderView, \
    DeleteWorkOrderView, AddWorkRequestView, ListWorkRequestView, GenerateOTView, AddResourcesOTView, WorkOrderListView, \
    UpdateWorkSupervisorView, DeleteResourceOTView, DeleteHelperOTView, AddHelpersOTView

app_name = "management"

urlpatterns = [
    path('works', WorkOrderListView.as_view(), name='list-word'),
    path('works/add', AddWorkOrderView.as_view(), name='add-work'),
    path('works/update/<int:pk>', UpdateWorkOrderView.as_view(), name='update-work'),
    path('works/delete/<int:pk>', DeleteWorkOrderView.as_view(), name='delete-work'),

    path('works/update/<int:pk>/resource', AddResourcesOTView.as_view(), name='add-resource '),
    path('works/delete/<int:pk>/resource', DeleteResourceOTView.as_view(), name='delete-resource '),

    path('works/update/<int:pk>/helper', AddHelpersOTView.as_view(), name='add-helper'),
    path('works/delete/<int:pk>/helper', DeleteHelperOTView.as_view(), name='delete-helper'),

    path('update-work-supervisor/<int:pk>', UpdateWorkSupervisorView.as_view(), name='update-work-supervisor'),
    path('list-work-request', ListWorkRequestView.as_view(), name='list-work-request'),
    path('add-work-request', AddWorkRequestView.as_view(), name='add-work-request'),
    path('generate-work', GenerateOTView.as_view(), name='generate-work '),

]
