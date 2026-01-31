import {  useState } from "react";
import { UserContext } from "./UserContext";
import type { UserContextType } from "./UserContext";
import { TokenService } from "../services/token.service";

type Props = { 
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
   !!TokenService.getAccessToken()
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

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
  };

  const value: UserContextType = {
    isAuthenticated,
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
