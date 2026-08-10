import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";


export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "CLIENT";
  imageUrl?: string | null;
  availableHours?: string[];
}

interface AuthContextData {
  user: User | null;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("@HelpDesk:token");
    const storedUser = localStorage.getItem("@HelpDesk:user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      api.get("/profile")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("@HelpDesk:user", JSON.stringify(res.data));
        })
        .catch(() => {
          signOut();
        });
    }

    // Listen for profile updates from ProfileModal
    function handleUserUpdated(event: CustomEvent<User>) {
      setUser(event.detail);
      localStorage.setItem("@HelpDesk:user", JSON.stringify(event.detail));
    }

    window.addEventListener("auth-user-updated", handleUserUpdated as EventListener);
    return () => window.removeEventListener("auth-user-updated", handleUserUpdated as EventListener);
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { user: userResponse, token } = response.data;

      localStorage.setItem("@HelpDesk:token", token);
      localStorage.setItem("@HelpDesk:user", JSON.stringify(userResponse));

      setUser(userResponse);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem("@HelpDesk:token");
    localStorage.removeItem("@HelpDesk:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
