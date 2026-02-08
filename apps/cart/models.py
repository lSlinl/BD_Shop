from django.db import models
from django.conf import settings
from apps.catalog.models import Item

# Create your models here.
User = settings.AUTH_USER_MODEL


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_price(self):
        return sum(item.total_price() for item in self.items.all())

    def __str__(self):
        return f"Cart of {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "item")

    def total_price(self):
        return self.quantity * self.item.price

    def __str__(self):
        return f"{self.item.name} x {self.quantity}"
