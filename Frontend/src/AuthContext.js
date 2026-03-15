import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // read from localStorage immediately so protected routes work on page reload
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));

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
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    setRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
