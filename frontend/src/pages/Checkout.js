import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

function Checkout() {
  const { cart, fetchCart } = useContext(CartContext);
  const { access } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart?.total_price || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!access) {
      alert("Войдите, чтобы оформить заказ");
      return;
    }
    if (!cart?.items?.length) {
        alert("Корзина пуста");
        return;
    }

    setLoading(true);

    try {
      await api.post(
        "orders/create/",
        {address,comment,});

      await fetchCart(); // обновляем корзину после оформления
      navigate("/orders");
    } catch (error) {
      console.error("Ошибка оформления заказа", error);
      alert("Ошибка оформления заказа. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    return <p>Ваша корзина пуста.</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Оформление заказа</h2>
      <p><b>Итого:</b> {total} silver</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Адрес доставки:</label><br />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{ width: "300px", marginBottom: "12px" }}
          />
        </div>

        <div>
          <label>Комментарий (опционально):</label><br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "300px", marginBottom: "12px" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Оформление..." : "Подтвердить заказ"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
