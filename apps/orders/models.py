from django.db import models
from django.conf import settings
from apps.catalog.models import Item

# Create your models here.

User = settings.AUTH_USER_MODEL


class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PROCESSING = "processing"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Ожидает"),
        (STATUS_PROCESSING, "В обработке"),
        (STATUS_COMPLETED, "Завершен"),
        (STATUS_CANCELLED, "Отменен"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="order")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    total_price = models.PositiveIntegerField(default=0)
    address = models.CharField(default="", max_length=100)
    comment = models.TextField(default="Без комментариев")
    created_at = models.DateTimeField(auto_now_add=True)

    def cancel(self):
        """Добавить возможность отмены заказа"""
        if self.status in [self.STATUS_PENDING, self.STATUS_PROCESSING]:
            self.status = self.STATUS_CANCELLED
            self.save()
            return True
        return False

    def __str__(self):
        return f"Заказ {self.id} от {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()

    class Meta:
        verbose_name_plural = "Order Items"
        verbose_name = "Order Item"

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"
