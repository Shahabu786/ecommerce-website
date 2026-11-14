import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "technest-user";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  function login(nextUser) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser)); } catch { /* storage can be disabled */ }
    setUser(nextUser);
  }

  function logout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage can be disabled */ }
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
