import React, {useContext} from "react";
import {CartContext} from "../context/CartContext";
import CartItemCard from "../components/CartItemCard";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const {cart, setCart} = useContext(CartContext);
    const navigate = useNavigate();

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item =>
            item.id === id ? {...item, quantity: newQuantity} : item
        ));
    };

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return <p>Ваша корзина пуста.</p>;
    }

    return (
        <div style={{padding: "24px"}}>
            <h2>Корзина</h2>

            {cart.map(item => (
                <CartItemCard
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                />
            ))}

            <h3>Итого: {total} silver</h3>

            <button
                onClick={() => navigate("/checkout")}
                style={{marginTop: "16px", padding: "6px 12px"}}
            >
                Перейти к оформлению
            </button>

        </div>
    );
}

export default CartPage;
