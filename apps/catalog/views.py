from django.shortcuts import render
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from .models import Category, Item
from .serializers import CategorySerializer, ItemSerializer
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.filters import SearchFilter

# Create your views here.


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ItemViewSet(ModelViewSet):
    queryset = Item.objects.filter(is_active=True)
    serializer_class = ItemSerializer
    filter_backends = [SearchFilter]
    search_fields = ["name", "description"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]
