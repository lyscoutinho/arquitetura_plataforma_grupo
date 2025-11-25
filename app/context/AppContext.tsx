'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Definição dos Tipos
export interface User {
  id: string;
  nome: string; // Ajustei para 'nome' (conforme seu JSON anterior)
  email: string;
  diretoria: string;
  role?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

interface AppContextType {
  // Estado do usuário e Auth
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;

  // Estado de notificações
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;

  // Estado de loading global
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Estado da sidebar mobile
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// 2. Criação do Contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// 3. Provider (Onde a lógica vive)
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Hooks de Estado (SÓ PODEM FICAR AQUI DENTRO)
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Lógica de Notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        token,
        setToken,
        notifications,
        addNotification,
        removeNotification,
        isLoading,
        setIsLoading,
        isSidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 4. Hook para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};