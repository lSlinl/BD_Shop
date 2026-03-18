from rest_framework import serializers
from .models import Order, OrderItem
from apps.catalog.serializers import ItemSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "item", "quantity", "price")
        read_only_fields = ("price",)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    date = serializers.DateTimeField(source="created_at", read_only=True)
    total = serializers.IntegerField(source="total_price", read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)
    status_display = serializers.CharField(source="status.display", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "total",
            "address",
            "comment",
            "status",
            "status_display",
            "date",
            "items",
            "user",
            "user_username",
        )
        read_only_fields = ("total_price", "created_at", "user")

    def validate_status(self, value):
        """Валидация статуса"""
        valid_status = ["pending", "processing", "completed", "cancelled"]
        if value not in valid_status:
            raise serializers.ValidationError(f"Недоступный статус.")
        return value
