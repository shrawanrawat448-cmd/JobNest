import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jobnest_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const save = ({ token, user }) => {
    localStorage.setItem("jobnest_token", token);
    localStorage.setItem("jobnest_user", JSON.stringify(user));
    setUser(user);
  };
  const login = async (data) => {
    const r = await api.post("/auth/login", data);
    save(r.data);
    return r.data.user;
  };
  const register = async (data) => {
    const r = await api.post("/auth/register", data);
    save(r.data);
    return r.data.user;
  };
  const logout = () => {
    localStorage.removeItem("jobnest_token");
    localStorage.removeItem("jobnest_user");
    setUser(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("jobnest_token");
    if (!token) return;
    setLoading(true);
    api
      .get("/auth/me")
      .then((r) => {
        const u = r.data.user;
        setUser(u);
        localStorage.setItem("jobnest_user", JSON.stringify(u));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
