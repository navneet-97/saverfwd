import { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState('login');

  const openAuthModal = useCallback((tab = 'login') => {
    setDefaultTab(tab);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, defaultTab, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within an AuthModalProvider');
  return context;
}
