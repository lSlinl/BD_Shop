from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.cart.models import Cart, CartItem
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Order, OrderItem
from .serializers import OrderSerializer
from rest_framework.views import APIView


# Create your views here.


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)

        if not cart.items.exists():
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_price = 0

        for cart_item in cart.items.all():
            if not cart_item.item.is_active:
                return Response(
                    {"detail": f"Item {cart_item.item.name} is inactive"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            total_price += cart_item.item.price * cart_item.quantity

        address = request.data.get("address")
        if not address:
            return Response(
                {"detail": "Address is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
            address=request.data.get("address"),
            comment=request.data.get("comment", ""),
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price=cart_item.item.price,
            )

        cart.items.all().delete()
        cart.total_price = 0
        cart.save()

        serializer = OrderSerializer(order)
        return Response({"results": serializer.data})


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

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
