import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define types
interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, isActive: boolean) => void;
  deleteUser: (id: string) => void;
  loadUsers: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  error: null,
  users: [],
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  loadUsers: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Backend-URL ggf. anpassen
const API = axios.create({
  baseURL: 'https://aschauwohnung.onrender.com/api',
  withCredentials: true,
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchCsrfToken = async () => {
    const res = await API.get('/csrf-token');
    setCsrfToken(res.data.csrfToken);
    return res.data.csrfToken;
  };

  // Initial Auth-Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/me');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login
  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const token = await fetchCsrfToken();
      const res = await API.post('/login', { username, password }, { headers: { 'x-csrf-token': token } });
      setUser(res.data);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.error || 'Login fehlgeschlagen');
      return false;
    }
  };

  // Logout
  const logout = async () => {
    const token = await fetchCsrfToken();
    await API.post('/logout', {}, { headers: { 'x-csrf-token': token } });
    setUser(null);
  };

  // Admin: User-Übersicht laden
  const loadUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch {}
  };

  // Admin: User anlegen
  const addUser = async (newUser: Omit<User, 'id'>) => {
    const token = await fetchCsrfToken();
    await API.post('/users', newUser, { headers: { 'x-csrf-token': token } });
    loadUsers();
  };

  // Admin: User aktivieren/deaktivieren
  const updateUser = async (id: string, isActive: boolean) => {
    const token = await fetchCsrfToken();
    await API.patch(`/users/${id}/active`, { isActive }, { headers: { 'x-csrf-token': token } });
    loadUsers();
  };

  // Admin: User löschen
  const deleteUser = async (id: string) => {
    const token = await fetchCsrfToken();
    await API.delete(`/users/${id}`, { headers: { 'x-csrf-token': token } });
    loadUsers();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error,
    users,
    addUser,
    updateUser,
    deleteUser,
    loadUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};