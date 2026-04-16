import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const API = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await API.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        console.error("Fetch current user failed:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginWithGoogle = () => {
    window.location.href =
      "http://localhost:9090/oauth2/authorization/google?prompt=select_account";
  };

  const switchAccount = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (error) {
      console.error("Switch account logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const logout = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser: fetchCurrentUser,
        loginWithGoogle,
        switchAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}