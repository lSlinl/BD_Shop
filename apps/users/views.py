from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


# Create your views here.


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.orders.models import Order
        from apps.orders.serializers import OrderSerializer

        orders = Order.objects.filter(user=request.user).order_by("-created_at")[:10]

        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "phone": getattr(request.user, "phone", ""),
                "avatar": request.user.avatar.url if request.user.avatar else None,
                "role": getattr(request.user, "role", ""),
                "orders_count": orders.count(),
                "recent_orders": OrderSerializer(orders, many=True).data,
                "date_joined": request.user.date_joined.strftime("%d/%m/%y"),
                "address": getattr(request.user, "address", ""),
            }
        )

    def patch(self, request):
        user = self.request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserCabinetSerializer(user).data)
        return Response(serializer.errors, status=400)
