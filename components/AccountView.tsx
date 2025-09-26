"use client";

import {
  IconUser,
  IconStar,
  IconCoin,
  IconSettings,
  IconHistory,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useState } from "react";

export default function AccountView() {
  const { data: session, isPending } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn.email({
        email,
        password,
      });
      setShowSignIn(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp.email({
        email,
        password,
        name,
      });
      setShowSignIn(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Sign In Prompt */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-600 mb-6">
              Access your profile, reviews, and earn tokens
            </p>
            <button
              onClick={() => setShowSignIn(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <IconLogin className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Sign In Modal */}
          {showSignIn && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </h3>
                  <button
                    onClick={() => setShowSignIn(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                  {isSignUp && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isSignUp ? "Create Account" : "Sign In"}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Token System Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Earn Tokens by Signing Up!
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Create an account to start earning tokens by writing reviews for
              Hong Kong attractions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sign up bonus</span>
                <span className="font-medium text-yellow-600">+100 tokens</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Write a review</span>
                <span className="font-medium text-yellow-600">+50 tokens</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Add photos</span>
                <span className="font-medium text-yellow-600">+25 tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <IconUser className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {session.user.name || "User"}!
              </h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IconLogout className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tokens & Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <IconCoin className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tokens</p>
                <p className="text-xl font-semibold text-gray-900">1,250</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <IconStar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <IconHistory className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Review History</p>
                <p className="text-sm text-gray-600">View all your reviews</p>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <IconSettings className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-600">Manage your preferences</p>
              </div>
            </button>
          </div>
        </div>

        {/* Token System Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Earn More Tokens!
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Write reviews for Hong Kong attractions to earn tokens. Use tokens
            for exclusive rewards and discounts.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Write a review</span>
              <span className="font-medium text-yellow-600">+50 tokens</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Add photos</span>
              <span className="font-medium text-yellow-600">+25 tokens</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Detailed review (100+ words)
              </span>
              <span className="font-medium text-yellow-600">+25 tokens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
