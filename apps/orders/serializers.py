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

    class Meta:
        model = Order
        fields = ("id", "user", "status", "total_price", "created_at", "items")
        read_only_fields = ("total_price", "created_at", "status")
