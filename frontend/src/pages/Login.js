import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (error) {
      alert("Ошибка авторизации");
    }
  };

  return (
    <div className="section" align="center">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input className="text-area"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        /><br/>
        <input className="text-area"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /><br/>
        <button className="btn btn-primary">Войти</button>
      </form>
    </div>
  );
}

export default Login;
