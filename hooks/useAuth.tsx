"use client";

import { useSession } from "@/lib/auth-client";
import { useLogin } from "@/components/LoginProvider";

export function useAuth() {
  const { data: session, isPending } = useSession();
  const { openLogin } = useLogin();

  const requireAuth = (callback: () => void) => {
    if (session?.user) {
      callback();
    } else {
      openLogin();
    }
  };

  return {
    user: session?.user,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    login: openLogin,
    requireAuth, // Helper function to require authentication before executing an action
  };
}
