import {createContext, useState, useEffect, useContext, useCallback} from "react";
import api from "../api/api";
import {AuthContext} from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const {access} = useContext(AuthContext);
    const [cart, setCart] = useState({
        items: [],
        total_items: 0,
        total_price: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!access) {
            setCart({
                items: [],
                total_items: 0,
                total_price: 0
            });
            return;
        }
        setLoading(true);
        try {
            const res = await api.get("cart/");
            setCart(res.data);
        } catch (err) {
            console.error("Ошибка загрузки корзины", err);
        } finally {
            setLoading(false);
        }
    }, [access]);

    const addItem = async (itemId, quantity = 1) => {
        if (!access) {
            alert("Войдите, чтобы добавить товар в корзину");
            return;
        }
        setLoading(true);
        try {
            await api.post("cart/add/", {item_id: itemId, quantity});
            await fetchCart();
        } catch (err) {
            console.error("Ошибка добавления товара", err);
            alert("Ошибка добавления товара. Попробуйте снова.");
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (cartItemId, quantity) => {
        if (!access) {
            alert("Войдите, чтобы обновить корзину");
            return;
        }
        if (quantity < 1) return; // Предотвращаем нулевую quantity
        setLoading(true);
        try {
            await api.patch(`cart/update/${cartItemId}/`, {quantity});
            await fetchCart();
        } catch (err) {
            console.error("Ошибка обновления товара", err);
            alert("Ошибка обновления товара.");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (cartItemId) => {
        if (!access) {
            alert("Войдите, чтобы удалить товар из корзины");
            return;
        }
        setLoading(true);
        try {
            await api.delete(`cart/delete/${cartItemId}/`);
            await fetchCart();
        } catch (err) {
            console.error("Ошибка удаления товара", err);
            alert("Ошибка удаления товара.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!access) {
            setCart({
                items: [],
                total_items: 0,
                total_price: 0
            });
        } else {
            fetchCart();
        }
    }, [access, fetchCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addItem,
                updateItem,
                removeItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};