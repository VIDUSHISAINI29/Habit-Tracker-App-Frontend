import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  // Safely load user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.log("Error parsing user from localStorage:", error.message);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Set Axios default header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  // Function to check token expiration
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
  };

  // Auto-logout if token is expired
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, []);


  // register user function

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/auth/register`, {name, email, password});
      const {user} = res.data;
      login(email, password);
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const { token, user } = res.data;
      console.log('login response= ',token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      // console.log('login response= ', token);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };



  return (
    <AuthContext.Provider value={{ user, register, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
