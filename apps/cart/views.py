from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Cart, CartItem
from apps.catalog.models import Item
from .serializers import CartSerializer

# Create your views here.


class CartView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.date.get("item_id")
        quantity = int(request.date.get("quantity", 1))

        item = Item.objects.get(id=item_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item)

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"detail": "Item added to cart"}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.date.get("item_id")
        cart = Cart.objects.get(user=request.user)

        CartItem.objects.filter(cart=cart, item_id=item_id).delete()

        return Response({"detail": "Item removed"})


class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({"detail": "Cart cleared"})


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.date.get("item_id")
        quantity = int(request.date.get("quantity", 1))
        item = Item.objects.get(id=item_id)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def update_item(self, request, pk=None):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item = CartItem.objects.get(id=pk, cart=cart)
        quantity = int(request.date.get("quantity", cart_item.quantity))
        if quantity < 1:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete_item(self, request, pk=None):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item = CartItem.objects.get(id=pk, cart=cart)
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
