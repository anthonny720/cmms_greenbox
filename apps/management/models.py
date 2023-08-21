from django.contrib.auth import get_user_model
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone
from simple_history.models import HistoricalRecords

from apps.assets.models import Tool, Physical
from apps.config.models import Type, Failure
from apps.store.models import Article
from apps.users.models import UserAccount

User = get_user_model()


# Create your models here.

class WorkOrder(models.Model):
    class Meta:
        verbose_name = 'Orden de Trabajo'
        verbose_name_plural = 'Ordenes de Trabajo'
        ordering = ['date_report']

    date_report = models.DateTimeField(verbose_name='Fecha de reporte', default=timezone.now)

    date_start = models.DateTimeField(verbose_name='Fecha de inicio', blank=True, null=True)
    date_finish = models.DateTimeField(verbose_name='Fecha de finalización', blank=True, null=True)

    asset = models.ForeignKey(Physical, on_delete=models.PROTECT, verbose_name='Activo', blank=True, null=True,
                              related_name='work_orders')
    type_maintenance = models.ForeignKey(Type, on_delete=models.PROTECT, verbose_name='Tipo de mantenimiento',
                                         blank=True, null=True)
    failure = models.ForeignKey(Failure, on_delete=models.PROTECT, verbose_name='Origen de falla', blank=True,
                                null=True)
    description = models.TextField(verbose_name='Descripción', blank=True, null=True)
    activities = models.TextField(verbose_name='Actividades', blank=True, null=True)
    resources_used = models.ManyToManyField(Article, through='ResourceItem', verbose_name='Recursos utilizados',
                                            blank=True, null=True)
    # responsable en ingles
    technical = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Técnico', blank=True, null=True,
                                  related_name='work_orders_technical')
    helpers = models.ManyToManyField(User, verbose_name='Ayudantes', blank=True, through='HelperItem',
                                     related_name='work_orders_helpers')
    tools = models.ManyToManyField(Tool, verbose_name='Herramientas', blank=True)
    status = models.BooleanField(verbose_name='Estado', default=False)
    observations = models.TextField(verbose_name='Observaciones', blank=True, null=True)
    planned = models.BooleanField(verbose_name='Planificado', default=False)
    validated = models.BooleanField(verbose_name='Validado', default=False)
    supervisor = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Supervisor', blank=True,
                                   null=True, related_name='work_orders_supervisor')
    created = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code

    @property
    def code(self):
        data = WorkOrder._base_manager.filter(
            created__year=self.date_report.year,
            created__lt=self.date_report
        ).count() + 1
        return "OT" + "-" + str(self.date_report.year)[2:] + str(self.date_report.month).zfill(2) + str(data)

    def get_time(self):
        try:
            return self.date_finish - self.date_start
        except:
            return None

    def get_personnel(self):
        try:
            data = []
            technical = self.technical
            cost = (self.get_time().total_seconds() / 60) * float(technical.category.salary)
            data.append({'name': technical.get_full_name(), 'cost': cost, 'signature': technical.get_signature()})

            for helper in self.helpers_order.all():
                try:
                    time = helper.get_time()
                    cost = (time.total_seconds() / 60) * float(helper.helper.category.salary)
                    signature = helper.helper.get_signature()
                    time_str = helper.date_start.strftime('%I:%M %p') + ' - ' + helper.date_finish.strftime('%I:%M %p')

                    data.append(
                        {'name': helper.helper.get_full_name(), 'cost': cost, 'signature': signature, 'time': time_str})
                except:
                    pass
            return data
        except Exception as e:
            return ['Error: ' + str(e)]

    def get_cost_personnel(self):
        cost = 0
        for item in self.get_personnel():
            try:
                cost += item['cost']
            except:
                pass
        return cost

    def get_cost(self):
        cost = 0
        try:
            cost = sum(resource.price for resource in self.resources_order.all())
            cost += self.get_cost_personnel()
        except:
            pass
        return cost

    def get_signature_boss(self):
        try:
            user = get_object_or_404(User, role='B')
            return user.get_signature()
        except Exception as e:
            return ""

    def get_planner_name(self):
        try:
            user = get_object_or_404(User, role='P')
            return user.get_full_name()
        except Exception as e:
            return ""

    def get_signature_planner(self):
        try:
            user = get_object_or_404(User, role='P')
            return user.get_signature()
        except Exception as e:
            return ""

    def get_signature_supervisor(self):
        try:
            if self.validated:
                user = get_object_or_404(User, role='S')
                return user.get_signature()
            else:
                return ""
        except Exception as e:
            return ""


class HelperItem(models.Model):
    class Meta:
        verbose_name = 'Ayudante'
        verbose_name_plural = 'Ayudantes'
        ordering = ['work_order']
        unique_together = ('work_order', 'helper')

    work_order = models.ForeignKey(WorkOrder, on_delete=models.PROTECT, verbose_name='Orden de trabajo',
                                   related_name='helpers_order')
    helper = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Ayudante',
                               related_name='helpers_helper')
    date_start = models.DateTimeField(verbose_name='Fecha de inicio')
    date_finish = models.DateTimeField(verbose_name='Fecha de finalización')
    history = HistoricalRecords()

    def get_time(self):
        try:
            return self.date_finish - self.date_start
        except:
            return None

    def __str__(self):
        return self.helper.get_full_name()


#
class ResourceItem(models.Model):
    class Meta:
        verbose_name = 'Recurso'
        verbose_name_plural = 'Recursos'
        ordering = ['work_order']

    work_order = models.ForeignKey(WorkOrder, on_delete=models.PROTECT, verbose_name='Orden de trabajo',
                                   related_name='resources_order')
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, verbose_name='Artículo',
                                related_name='resources_article', null=True)
    quantity = models.PositiveIntegerField(verbose_name='Cantidad', default=1)
    price = models.DecimalField(verbose_name='Precio', max_digits=10, decimal_places=2, default=0, blank=True, )
    name = models.CharField(verbose_name='Nombre', max_length=100, blank=True, null=True)

    def __str__(self):
        return self.article.description

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.price = self.article.value * self.quantity
        self.name = self.article.description
        super().save(force_insert, force_update, using, update_fields)


class WorkRequest(models.Model):
    date_report = models.DateTimeField(verbose_name='Fecha de reporte', default=timezone.now)
    asset = models.ForeignKey(Physical, on_delete=models.PROTECT, verbose_name='Activo', blank=True, null=True)
    description = models.TextField(verbose_name='Descripción', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name='Usuario')
    work_order = models.OneToOneField(WorkOrder, on_delete=models.PROTECT, verbose_name='Orden de trabajo', blank=True,
                                      null=True)

    def __str__(self):
        return str(self.date_report)

    class Meta:
        verbose_name = 'Solicitud de trabajo'
        verbose_name_plural = 'Solicitudes de trabajo'
        ordering = ['-date_report']
