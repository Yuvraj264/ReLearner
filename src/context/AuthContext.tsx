import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: string;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
  switchRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string>(localStorage.getItem("role") || "learner");
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!token;

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setRole(userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setRole("learner");
    setUser(null);
  };

  const switchRole = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
