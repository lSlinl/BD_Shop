import React, { useState, useEffect } from "react";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import "./styles.css";

function App() {
  const [token, setToken] = useState("");

  // Получаем токен при запуске
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    })
      .then(res => res.json())
      .then(data => setToken(data.access));
  }, []);

  return (
    <div className="app-container">
      <h1>BD Shop</h1>
      <div className="main-grid">
        <Catalog token={token} />
        <Cart token={token} />
        <Orders token={token} />
      </div>
    </div>
  );
}

export default App;
