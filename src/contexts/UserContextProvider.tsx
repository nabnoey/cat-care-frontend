import { useState } from "react";
import { UserContext } from "./UserContext";
import type { UserContextType } from "./UserContext";
import { TokenService } from "../services/token.service";
import type { User } from "../types";

type Props = { 
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!TokenService.getAccessToken()
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );
  const [user, setUser] = useState<User | null>(null);

  const logIn = (token: string, userRole: string) => {
    TokenService.setToken(token);
    localStorage.setItem("role", userRole);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenService.removeToken();
    localStorage.removeItem("role");
    setRole(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: UserContextType = {
    user,                // ✅ ส่งให้ครบตาม type
    isAuthenticated,     // ✅ ไม่มี S แล้ว
    role,
    logIn,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
