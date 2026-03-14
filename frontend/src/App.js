import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home"; // Добавили импорт
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrdersPage from "./pages/OrdersPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Profile from "./pages/Profile"; // Добавили импорт (если пустой, заполним ниже)

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/> {/* Заменили заглушку */}
                <Route path="/catalog" element={<Catalog/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route
                    path="/cart/checkout"
                    element={
                        <PrivateRoute>
                            <Checkout/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <PrivateRoute>
                            <OrdersPage/>
                        </PrivateRoute>
                    }
                />
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
            <Footer/> {/* Добавили футер */}
        </BrowserRouter>
    );
}

export default App;