from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.cart.models import Cart, CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer


# Create your views here.


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        if not cart.items.exists():
            return Response(
                {"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        total_price = 0
        for cart_item in cart.items.all():
            if not cart_item.is_active:
                return Response(
                    {"detail": f"Item {cart_item.item.name} is inactive"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            total_price += cart_item.item.price * cart_item.quantity

        order = Order.objects.create(user=request.user, total_price=cart.total_price())

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price=cart_item.item.price,
            )

        # очистка корзины после оформления
        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if order.cancel():
            return Response({"detail": "Order cancelled"})
        return Response(
            {"detail": "Cannot cancel this order"}, status=status.HTTP_400_BAD_REQUEST
        )
