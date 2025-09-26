"use client";

import { useState } from "react";
import { IconLogin } from "@tabler/icons-react";
import { useSession } from "@/lib/auth-client";
import LoginDialog from "./LoginDialog";

interface LoginTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function LoginTrigger({ children, className }: LoginTriggerProps) {
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Don't render if user is already logged in
  if (session?.user) {
    return null;
  }

  const defaultTrigger = (
    <button
      onClick={() => setShowLoginDialog(true)}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 ${className || ''}`}
    >
      <IconLogin className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );

  return (
    <>
      {children ? (
        <div onClick={() => setShowLoginDialog(true)} className={className}>
          {children}
        </div>
      ) : (
        defaultTrigger
      )}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}
