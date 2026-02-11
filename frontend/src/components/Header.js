import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
// import "./Header.css"

function Header() {
  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
  );

  return (
    <header className="header">
        <div className="nav-container">
            <Link to="/" className="logo">
                <span className="logo-icon">⚔️</span> BDO Shop</Link>
        </div>

        <nav className="nav-menu">
            <Link to="/catalog" className="nav-link">Каталог</Link>
            <Link to="/cart">Корзина</Link>
            <Link to="/orders">Заказы</Link>
        </nav>

        <div className="nav-actions">
            <Link to="/cart" className="btn">
                🛒 {totalItems >0 && <span className="cart-badge">{totalItems}</span> }
            </Link>
            <button className="auth-btn">Login</button>
        </div>
    </header>
  );
}

export default Header;
