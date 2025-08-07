import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Configurar axios para incluir cookies automáticamente
axios.defaults.withCredentials = true;

// Función para obtener la URL base de la API
const getApiUrl = () => {
  // En producción, usar la URL relativa. En desarrollo, usar la variable de entorno
  if (import.meta.env.PROD) {
    return "/api"; // URL relativa para producción
  }
  return import.meta.env.VITE_API_URL || "http://localhost:3001/api";
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/auth/verify`);

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Token no válido o expirado");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${getApiUrl()}/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${getApiUrl()}/auth/logout`);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
