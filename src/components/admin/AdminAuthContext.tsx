import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminAuthContextType {
  token: string | null;
  isMounted: boolean;
  loginError: string | null;
  isLoggingIn: boolean;
  handleLoginSubmit: (
    e: React.FormEvent,
    usernameInput: string,
    passwordInput: string,
  ) => Promise<void>;
  handleLogout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

// Helper for managing the JWT token cookie
const setTokenCookie = (val: string) => {
  document.cookie = `admin_token=${val}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
};

const clearTokenCookie = () => {
  document.cookie = "admin_token=; path=/; max-age=0";
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    setIsMounted(true);
    const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
    if (match) {
      setToken(match[1]);
    }
  }, []);

  const handleLogout = () => {
    clearTokenCookie();
    setToken(null);
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    } as Record<string, string>;
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleLogout();
      throw new Error("Session expired. Please log in again.");
    }
    return res;
  };

  const handleLoginSubmit = async (
    e: React.FormEvent,
    usernameInput: string,
    passwordInput: string,
  ) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setLoginError("Invalid username or password");
        } else {
          setLoginError("Server communication failed.");
        }
        setIsLoggingIn(false);
        return;
      }

      const data = await res.json();
      if (data.token) {
        setTokenCookie(data.token);
        setToken(data.token);
      }
    } catch (err) {
      setLoginError("Network connection failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        isMounted,
        loginError,
        isLoggingIn,
        handleLoginSubmit,
        handleLogout,
        fetchWithAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
