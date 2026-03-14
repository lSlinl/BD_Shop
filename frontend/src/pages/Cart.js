import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cart, updateItem, removeItem } = useContext(CartContext);
  const navigate = useNavigate();
// console.log("Новые items после fetch:", cart.items.map(i => ({id: i.id, name: i.item.name})));
  if (!cart || cart.items.length === 0) {
    return <p>Ваша корзина пуста.</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Корзина</h2>

      {cart.items.map((item) => (
        <div key={item.id} style={{ marginBottom: "16px", border: "1px solid #444", padding: "12px", borderRadius: "8px" }}>
          <h4>{item.item.name}</h4>
          <p>{item.item.price} silver x {item.quantity} = {item.item.price * item.quantity} silver</p>

          <button onClick={() => updateItem(item.id, item.quantity - 1)}> - </button>

          <span style={{ margin: "0 12px", fontWeight: "bold" }}>{item.quantity}</span>

          <button onClick={() => updateItem(item.id, item.quantity + 1)}> + </button>

          <button
            onClick={() => removeItem(item.id)}
            style={{ marginLeft: "16px", color: "#ff5252" }}
          >
            Удалить
          </button>
        </div>
      ))}

      <h3>Итого: {cart.total_price} silver</h3>

      <button
        onClick={() => navigate("checkout")}
        style={{ marginTop: "16px" }}
      >
        Перейти к оформлению
      </button>
    </div>
  );
}

export default CartPage;
