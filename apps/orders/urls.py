from django.urls import path
from .views import CreateOrderView, UserOrdersView, CancelOrderView, AdminOrdersView

urlpatterns = [
    path("create/", CreateOrderView.as_view(), name="create_order"),
    path("my-orders/", UserOrdersView.as_view(), name="user_orders"),
    path("cancel/<int:order_id>/", CancelOrderView.as_view(), name="cancel_order"),
    path("order_admin/", AdminOrdersView.as_view(), name="admin_orders"),
    path(
        "order_admin/<int:pk>/", AdminOrdersView.as_view(), name="admin_orders_detail"
    ),
]
