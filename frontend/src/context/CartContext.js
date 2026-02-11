import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  return (<CartContext.Provider value={{ cart, setCart }}>
      {children}
  </CartContext.Provider> )

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async (itemId, quantity = 1) => {
    await api.post("/cart/add/", { item_id: itemId, quantity });
    fetchCart();
  };

  const updateItem = async (itemId, quantity) => {
    await api.patch("/cart/update/", { item_id: itemId, quantity });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete("/cart/remove/", { data: { item_id: itemId } });
    fetchCart();
  };

  const checkout = async () => {
    await api.post("/orders/create/");
    fetchCart();
  };

  useEffect(() => { fetchCart(); }, []);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, checkout }}>
      {children}
    </CartContext.Provider>
  );
};
