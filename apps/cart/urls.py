from django.urls import path
from .views import CartViewSet

cart_list = CartViewSet.as_view({"get": "list"})
cart_add = CartViewSet.as_view({"post": "add_item"})
cart_update = CartViewSet.as_view({"patch": "update_item"})
cart_delete = CartViewSet.as_view({"delete": "delete_item"})

urlpatterns = [
    path("", cart_list, name="cart"),
    path("add/", cart_add, name="cart-add"),
    path("update/<int:pk>/", cart_update, name="cart-update"),
    path("delete/<int:pk>/", cart_delete, name="cart-delete"),
]

# Не работает на DRF
