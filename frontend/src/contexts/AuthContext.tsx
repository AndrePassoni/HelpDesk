import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";


export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "CLIENT";
  imageUrl?: string | null;
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
      // O interceptor do axios já coloca o token no Header
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function signIn({ email, password }: any) {
    try {
      // MOCK AUTHENTICATION: Para testar as diferentes Roles no Frontend.
      // Se o email contiver "admin", loga como Admin. "tecnico" como Técnico, etc.
      let mockRole: "ADMIN" | "TECHNICIAN" | "CLIENT" = "CLIENT";
      if (email.includes("admin")) mockRole = "ADMIN";
      else if (email.includes("tecnico")) mockRole = "TECHNICIAN";

      const mockUser: User = {
        id: "mock-123",
        name: email.split("@")[0],
        email: email,
        role: mockRole,
      };

      const mockToken = "mock-jwt-token";

      localStorage.setItem("@HelpDesk:token", mockToken);
      localStorage.setItem("@HelpDesk:user", JSON.stringify(mockUser));

      setUser(mockUser);
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
