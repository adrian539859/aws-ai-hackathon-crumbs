"use client";

import {
  IconUser,
  IconStar,
  IconCoin,
  IconHistory,
  IconLogin,
  IconLogout,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { TokenHistory } from "@/lib/types";

interface UserStats {
  tokenBalance: number;
  reviewsCount: number;
}

interface UserReview {
  id: string;
  attractionId: string;
  attractionName: string;
  attractionImageUrl?: string;
  rating: number;
  title?: string;
  content: string;
  isVerified: boolean;
  tokensEarned: number;
  createdAt: string;
  updatedAt: string;
}

export default function AccountView() {
  const { data: session, isPending } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // New state for real data
  const [userStats, setUserStats] = useState<UserStats>({
    tokenBalance: 0,
    reviewsCount: 0,
  });
  const [tokenHistory, setTokenHistory] = useState<TokenHistory[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user stats (token balance and reviews count)
  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  // Fetch token history
  const fetchTokenHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tokens?limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTokenHistory(data.history);
        }
      }
    } catch (error) {
      console.error("Error fetching token history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user reviews
  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/reviews?limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserReviews(data.reviews);
        }
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load user data when session changes
  useEffect(() => {
    if (session?.user) {
      fetchUserStats();
    }
  }, [session]);

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

      // Award signup bonus tokens
      try {
        await fetch("/api/tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 100,
            type: "bonus",
            source: "signup",
            description: "Welcome bonus for signing up!",
            metadata: { signupDate: new Date().toISOString() },
          }),
        });
      } catch (tokenError) {
        console.error("Failed to award signup bonus:", tokenError);
      }

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
                <p className="text-xl font-semibold text-gray-900">
                  {userStats.tokenBalance.toLocaleString()}
                </p>
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
                <p className="text-xl font-semibold text-gray-900">
                  {userStats.reviewsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            <button
              onClick={() => {
                setShowTokenHistory(!showTokenHistory);
                if (!showTokenHistory && tokenHistory.length === 0) {
                  fetchTokenHistory();
                }
              }}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <IconCoin className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Token History</p>
                <p className="text-sm text-gray-600">
                  View your token transactions
                </p>
              </div>
              {showTokenHistory ? (
                <IconChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => {
                setShowReviewHistory(!showReviewHistory);
                if (!showReviewHistory && userReviews.length === 0) {
                  fetchUserReviews();
                }
              }}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <IconHistory className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Review History</p>
                <p className="text-sm text-gray-600">View all your reviews</p>
              </div>
              {showReviewHistory ? (
                <IconChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Token History Section */}
        {showTokenHistory && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Token History
            </h3>
            {loading && tokenHistory.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : tokenHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No token transactions yet. Start by writing reviews!
              </p>
            ) : (
              <div className="space-y-3">
                {tokenHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()} •{" "}
                        {transaction.source}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount} tokens
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Review History Section */}
        {showReviewHistory && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review History
            </h3>
            {loading && userReviews.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : userReviews.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No reviews yet. Start exploring and reviewing attractions!
              </p>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {review.attractionName}
                        </h4>
                        {review.title && (
                          <p className="text-sm text-gray-600">
                            {review.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {[...Array(5)].map((_, i) => (
                          <IconStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {review.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        {review.isVerified && (
                          <span className="text-green-600 font-medium">
                            Verified
                          </span>
                        )}
                        <span className="text-yellow-600 font-medium">
                          +{review.tokensEarned} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
