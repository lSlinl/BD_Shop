import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { OrdersContext } from "../context/OrdersContext";
import CartItemCard from "../components/CartItemCard";

function CheckoutPage() {
  const { cart, setCart } = useContext(CartContext);
  const { orders, setOrders } = useContext(OrdersContext);

  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) return alert("Введите адрес доставки!");

    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total,
      address,
      comment,
      date: new Date().toLocaleString(),
    };

    setOrders([...orders, newOrder]);
    setCart([]); // очистка корзины
    setSuccess(true);
  };

  // Если заказ оформлен, показываем сообщение
  if (success) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>Заказ успешно оформлен!</h2>
        <p>Итого: {total} silver</p>
        <p>Адрес доставки: {address}</p>
        <p>Комментарий: {comment}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Оформление заказа</h2>

      {cart.length === 0 ? (
        <p>Ваша корзина пуста. Добавьте товары из каталога.</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}

          <h3>Итого: {total} silver</h3>

          {/* Форма оформления заказа */}
          <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <div>
              <label>Адрес доставки:</label><br/>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                style={{ width: "300px", padding: "4px", marginTop: "4px" }}
              />
            </div>

            <div style={{ marginTop: "8px" }}>
              <label>Комментарий:</label><br/>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: "300px", padding: "4px", marginTop: "4px" }}
              />
            </div>

            <button type="submit" style={{ marginTop: "12px", padding: "6px 12px" }}>
              Подтвердить заказ
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
