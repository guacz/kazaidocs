import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isModalOpen: false,
  isLoading: false,
  error: null,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check local storage for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const login = async (email: string, phone?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple validation
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // For MVP, we'll just set the user directly without actual authentication
      // In a real app, this would call an auth API
      const newUser = { email, phone };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      closeAuthModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isModalOpen,
    isLoading,
    error,
    openAuthModal,
    closeAuthModal,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);