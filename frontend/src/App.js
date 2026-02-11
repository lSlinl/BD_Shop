import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Header from "./components/Header"
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrdersPage from "./pages/OrdersPage";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<h2>Promotional Banner</h2>}/>
                <Route path="/catalog" element={<Catalog />}/>
                <Route path="/cart" element={<Cart />}/>
                <Route path="/checkout" element={<Checkout />}/>
                <Route path="/orders" element={<OrdersPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
