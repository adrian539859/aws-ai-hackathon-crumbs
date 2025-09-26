"use client";

import { useState, useEffect } from "react";
import { IconUser, IconLogin } from "@tabler/icons-react";
import { useSession, signIn } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Login Dialog Component
 *
 * A modal dialog for user authentication with prefilled demo credentials.
 * Features:
 * - Prefilled demo email (demo@crumbs.ai) and password (demo1234)
 * - Sign up functionality disabled for demo mode
 * - Auto-closes when user successfully authenticates
 * - Loading states and error handling
 *
 * Usage: Use via LoginProvider context or directly with open/onOpenChange props
 */

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("demo@crumbs.ai");
  const [password, setPassword] = useState("demo1234");
  const [isLoading, setIsLoading] = useState(false);

  // Close dialog if user is authenticated
  useEffect(() => {
    if (session?.user) {
      onOpenChange(false);
    }
  }, [session, onOpenChange]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn.email({
        email,
        password,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Sign in failed:", error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <IconUser className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Sign in to your account
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Access your profile, reviews, and earn tokens
          </p>
        </DialogHeader>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <IconLogin className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo Mode:</strong> Use the prefilled credentials to sign in
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
