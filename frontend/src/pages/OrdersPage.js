import React, { useContext } from "react";
import { OrdersContext } from "../context/OrdersContext";

function OrdersPage() {
  const { orders } = useContext(OrdersContext);

  if (orders.length === 0) {
    return <p>У вас пока нет заказов.</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>История заказов</h2>

      {orders
        .slice()
        .reverse() // последние сверху
        .map(order => (
          <div key={order.id} style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "12px" }}>
            <p><b>Дата:</b> {order.date}</p>
            <p><b>Адрес доставки:</b> {order.address}</p>
            <p><b>Комментарий:</b> {order.comment || "-"}</p>
            <p><b>Итого:</b> {order.total} silver</p>
            <h4>Товары:</h4>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>{item.name} x {item.quantity} = {item.price * item.quantity} silver</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default OrdersPage;
