import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {CartContext} from "../context/CartContext";
import {AuthContext} from "../context/AuthContext";

function Header() {
    const { cart } = useContext(CartContext);
    const {user, logout} = useContext(AuthContext);
    if (!cart) {return <p>Загрузка корзины...</p>}
    const totalItems = cart?.total_items || 0;

    return (
        <header className="header">
            <div className="nav-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">⚔️</span> BDO Shop</Link>

                <nav className="nav-menu">
                    <Link to="/catalog" className="nav-link">Каталог</Link>
                    <Link to="/cart">Корзина</Link>
                    <Link to="/orders">Заказы</Link>
                </nav>
                <div className="nav-actions" align="right">
                    {user ? (
                        <>
                            <Link to="/profile"><span>Привет, {user.username}</span></Link>
                            <button className="btn" onClick={logout}>Выход</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn">Login</button>
                            </Link>

                            <Link to="/register">
                                <button className="btn">Register</button>
                            </Link>
                        </>
                    )
                    }
                    <Link to="/cart" className="btn">
                        🛒 <span className="cart-badge">{totalItems}</span>
                    </Link>

                </div>
            </div>
        </header>
    );
}

export default Header;
