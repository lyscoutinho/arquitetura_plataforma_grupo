"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: Date;
}

interface AppContextType {
  // Usuário
  userInfo: User | null;
  setUserInfo: (info: User | null) => void;

  // Token
  token: string | null;
  setToken: (t: string | null) => void;

  // Notificações
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;

  // Loading global
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Sidebar mobile
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Logout
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userInfo");

    if (storedToken) {
      setTokenState(storedToken);
    }
    if (storedUser) {
      try {
        setUserInfoState(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isInitialized) return;

    const isLoginPage = pathname === "/login";

    if (!token && !isLoginPage) {
      router.push("/login");
    } else if (token && isLoginPage) {
      router.push("/");
    }
  }, [token, pathname, isInitialized, router]);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
  };

  const setUserInfo = (info: User | null) => {
    setUserInfoState(info);
    if (info) {
      localStorage.setItem("userInfo", JSON.stringify(info));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null);
    router.push("/login");
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  // Prevent rendering children until auth check is done (optional, but good for UX to avoid flash)
  // However, for now we render children but the useEffect will trigger redirect quickly.
  // To be stricter, we could return null if !isInitialized.
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

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
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
};
