import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setUser({ role }); 
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Mocking success
    localStorage.setItem('token', 'fake-jwt-token');
    const role = credentials.email.includes('admin') ? 'ADMIN' : 'VOTER';
    localStorage.setItem('role', role);
    setUser({ role });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
