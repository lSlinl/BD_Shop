from django.db import models
from django.conf import settings
from apps.catalog.models import Item


# Create your models here.


class Order(models.Model):
    STATUS_CHOICES = (
        ("new", "New"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    total_price = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
