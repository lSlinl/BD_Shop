import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      navigate("/login");
    } catch (error) {
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="section" align="center">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input className="text-area"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        /><br/>
        <input className="text-area"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        /><br/>
        <input className="text-area"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /><br/>
        <button className="btn btn-primary">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;
