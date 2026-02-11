import React from "react";

function CartItemCard({ item, updateQuantity, removeItem }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "12px" }}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p><b>{item.price} silver</b></p>

      <div style={{ marginTop: "8px" }}>
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
          -
        </button>
        <span style={{ margin: "0 8px" }}>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </button>

        <button
          style={{ marginLeft: "16px", color: "red" }}
          onClick={() => removeItem(item.id)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
