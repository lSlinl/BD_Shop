from rest_framework import serializers
from .models import Cart, CartItem
from apps.catalog.serializers import ItemSerializer


class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "item", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Cart
        fields = ["id", "items", "total_items", "total_price"]
