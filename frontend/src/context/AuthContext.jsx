import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

const normalizeRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ADMIN':
      return 'ADMIN';
    case 'ROLE_CANDIDATE':
    case 'CANDIDATE':
      return 'CANDIDATE';
    case 'ROLE_USER':
    case 'ROLE_VOTER':
    case 'VOTER':
    default:
      return 'VOTER';
  }
};

const applyAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    safeRemove(TOKEN_KEY);
    safeRemove(USER_KEY);
    applyAuthToken(null);
  };

  const checkAuth = async () => {
    const token = safeGet(TOKEN_KEY);
    if (!token) {
      clearAuth();
      setUser(null);
      setLoading(false);
      return;
    }

    applyAuthToken(token);
    try {
      const response = await axios.get('/api/auth/me');
      const nextUser = {
        ...response.data,
        role: normalizeRole(response.data.role)
      };
      setUser(nextUser);
      safeSet(USER_KEY, JSON.stringify(nextUser));
    } catch (err) {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = safeGet(USER_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, role: normalizeRole(parsedUser.role) });
      } catch {
        safeRemove(USER_KEY);
      }
    }
    const token = safeGet(TOKEN_KEY);
    if (token) {
      applyAuthToken(token);
    }
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await axios.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password
    });

    const token = response.data.token;
    const roles = response.data.roles || [];
    const nextUser = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: normalizeRole(response.data.role || roles[0]),
      roles
    };

    safeSet(TOKEN_KEY, token);
    safeSet(USER_KEY, JSON.stringify(nextUser));
    applyAuthToken(token);
    setUser(nextUser);

    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      age: Number(userData.age),
      role: userData.role,
      party: userData.party || null,
      description: userData.description || null,
      manifesto: userData.manifesto || null,
      imageUrl: userData.imageUrl || null
    });
    return response.data;
  };

  const logout = async () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
