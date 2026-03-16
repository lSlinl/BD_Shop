import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // Оставляем для refresh, если нужно без interceptors
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));

  const login = async (username, password) => {
    const response = await api.post("auth/login/", { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setAccess(access);
    setRefresh(refresh);
    await fetchUser();
  };

  const register = async (username, email, password) => {
    await api.post("auth/register/", { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccess(null);
    setRefresh(null);
    setUser(null);
  };

  const refreshToken = async () => {
    if (!refresh) return;
    try {
      // Используем axios для refresh, чтобы избежать добавления expired access в headers
      const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/token/refresh/", { refresh });
      localStorage.setItem("access", response.data.access);
      setAccess(response.data.access);
    } catch (error) {
      logout();
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("auth/me/");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    if (access) {
      fetchUser();
    }
  }, [access]);

  return (
    <AuthContext.Provider
      value={{
        user,
        access,
        login,
        logout,
        register,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};