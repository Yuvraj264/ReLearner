import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, currentLearner, currentAdmin } from '@/data/users.mock';
import { Role, ROLES } from '@/constants/roles';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(currentLearner);
  const [role, setRole] = useState<Role>(ROLES.LEARNER);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setUser(selectedRole === ROLES.ADMIN ? currentAdmin : currentLearner);
  };

  const logout = () => {
    setUser(null);
    setRole(ROLES.LEARNER);
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    setUser(newRole === ROLES.ADMIN ? currentAdmin : currentLearner);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
