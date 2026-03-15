import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // read from localStorage immediately so protected routes work on page reload
const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        logout();
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (e) {
      logout();
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    // this effect ensures state stays in sync if localStorage is modified elsewhere
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('userName');
    if (storedRole && storedRole !== role) setRole(storedRole);
    if (storedName && storedName !== userName) setUserName(storedName);
  }, [role, userName]);

  const login = (token, role, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userName', name);
    setRole(role);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setRole(null);
    setUserName(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, userName, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
