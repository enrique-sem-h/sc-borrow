"use client";
import { Usuario, UsuarioLogin } from "@/infra/database/schemas/usuariosSchema";
import { createContext, useState, useContext, useEffect } from "react";
import { login as loginAction, setApiToken } from "@/actions/login";
import apiService from "@/services/api";

type Context = {
  login: (data: UsuarioLogin) => void;
  logout: () => void;
  user: Usuario | null;
  isAuth: boolean;
};

const AuthContext = createContext<Context | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuth = !!user;

  useEffect(() => {
    (async () => {
      try {
        const user = localStorage.getItem("user");

        if (user) {
          setUser(JSON.parse(user));
        }

        const token = localStorage.getItem("token");

        if (token) {
          apiService.setToken(token);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  const login = async (data: UsuarioLogin) => {
    const response = await loginAction(data);

    const token = response.data.token;
    response.data.token = undefined;

    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("token", token);
    apiService.setToken(token);
    setUser(response.data);
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    apiService.setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access
export const useAuth = () => useContext(AuthContext);
