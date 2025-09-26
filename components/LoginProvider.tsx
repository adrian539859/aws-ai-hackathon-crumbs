"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import LoginDialog from "./LoginDialog";

interface LoginContextType {
  openLogin: () => void;
  closeLogin: () => void;
  isLoginOpen: boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function useLogin() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
}

interface LoginProviderProps {
  children: ReactNode;
}

export function LoginProvider({ children }: LoginProviderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <LoginContext.Provider value={{ openLogin, closeLogin, isLoginOpen }}>
      {children}
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </LoginContext.Provider>
  );
}
