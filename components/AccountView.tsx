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
  IconTree,
  IconLeaf,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { TokenHistory } from "@/lib/types";
import { useLogin } from "./LoginProvider";

interface UserStats {
  tokenBalance: number;
  reviewsCount: number;
}

interface TreePlanting {
  id: string;
  certificateId: string;
  treeCount: number;
  tokensCost: number;
  plantingLocation: string;
  status: string;
  createdAt: string;
  metadata?: string;
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
  const { openLogin } = useLogin();

  // New state for real data
  const [userStats, setUserStats] = useState<UserStats>({
    tokenBalance: 0,
    reviewsCount: 0,
  });
  const [tokenHistory, setTokenHistory] = useState<TokenHistory[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [treePlantings, setTreePlantings] = useState<TreePlanting[]>([]);
  const [totalTrees, setTotalTrees] = useState(0);
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);
  const [showTreeHistory, setShowTreeHistory] = useState(false);
  const [showTreeDonation, setShowTreeDonation] = useState(false);
  const [treesToPlant, setTreesToPlant] = useState(1);
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

  // Fetch tree plantings
  const fetchTreePlantings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trees?limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTreePlantings(data.trees);
          setTotalTrees(data.totalTrees);
        }
      }
    } catch (error) {
      console.error("Error fetching tree plantings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Plant trees
  const handlePlantTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          treeCount: treesToPlant,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh data
        await Promise.all([fetchUserStats(), fetchTreePlantings()]);
        setShowTreeDonation(false);
        setTreesToPlant(1);
        alert(
          data.message + `\nCertificate ID: ${data.treePlanting.certificateId}`
        );
      } else {
        alert(data.error || "Failed to plant trees");
      }
    } catch (error) {
      console.error("Error planting trees:", error);
      alert("Failed to plant trees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Buy tokens
  const handleBuyTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 10,
          type: "bonus",
          source: "purchase",
          description: "Purchased 10 tokens",
          metadata: { purchaseDate: new Date().toISOString() },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh user stats
        await fetchUserStats();
        alert("Successfully purchased 10 tokens!");
      } else {
        alert(data.error || "Failed to purchase tokens");
      }
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      alert("Failed to purchase tokens. Please try again.");
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
              onClick={openLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <IconLogin className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Token System Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Earn Tokens by Signing In!
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Sign in to start earning tokens by writing reviews for
              Hong Kong attractions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Write a review</span>
                <span className="font-medium text-yellow-600">+3 tokens</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Plant a tree (ESG)</span>
                <span className="font-medium text-green-600">10 tokens</span>
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
        <div className="grid grid-cols-3 gap-3 mb-6">
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

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IconTree className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Trees</p>
                <p className="text-xl font-semibold text-gray-900">
                  {totalTrees}
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
              onClick={handleBuyTokens}
              disabled={loading}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <IconShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Buy Tokens</p>
                <p className="text-sm text-gray-600">Get 10 tokens instantly</p>
              </div>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : (
                <span className="text-sm font-semibold text-blue-600">+10</span>
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

            <button
              onClick={() => setShowTreeDonation(!showTreeDonation)}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IconLeaf className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Plant Trees for ESG</p>
                <p className="text-sm text-gray-600">
                  Donate tokens to plant trees
                </p>
              </div>
              {showTreeDonation ? (
                <IconChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <IconChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={() => {
                setShowTreeHistory(!showTreeHistory);
                if (!showTreeHistory && treePlantings.length === 0) {
                  fetchTreePlantings();
                }
              }}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IconTree className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Tree History</p>
                <p className="text-sm text-gray-600">View your planted trees</p>
              </div>
              {showTreeHistory ? (
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

        {/* Tree Donation Section */}
        {showTreeDonation && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plant Trees for ESG 🌱
            </h3>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-4">
              <p className="text-green-800 text-sm mb-2">
                Support environmental sustainability by donating tokens to plant
                trees in Hong Kong!
              </p>
              <p className="text-green-700 text-xs">
                Each tree costs 10 tokens and helps offset carbon emissions
                while beautifying our city.
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Trees
                </label>
                <select
                  value={treesToPlant}
                  onChange={(e) => setTreesToPlant(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} tree{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Cost</p>
                <p className="text-xl font-semibold text-gray-900">
                  {treesToPlant * 10} tokens
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                <p>Your balance: {userStats.tokenBalance} tokens</p>
                <p>
                  After donation: {userStats.tokenBalance - treesToPlant * 10}{" "}
                  tokens
                </p>
              </div>
              <div className="text-sm text-green-600">
                <p>Carbon offset: ~{treesToPlant * 22}kg CO₂/year</p>
              </div>
            </div>

            <button
              onClick={handlePlantTrees}
              disabled={loading || userStats.tokenBalance < treesToPlant * 10}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <IconTree className="w-5 h-5" />
                  <span>
                    Plant {treesToPlant} Tree{treesToPlant > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tree History Section */}
        {showTreeHistory && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tree History 🌳
            </h3>
            {loading && treePlantings.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : treePlantings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No trees planted yet. Start contributing to our environment!
              </p>
            ) : (
              <div className="space-y-4">
                {treePlantings.map((tree) => {
                  const metadata = tree.metadata
                    ? JSON.parse(tree.metadata)
                    : {};
                  return (
                    <div
                      key={tree.id}
                      className="border border-green-200 rounded-lg p-4 bg-green-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <IconTree className="w-4 h-4 text-green-600" />
                            <span>
                              {tree.treeCount} Tree
                              {tree.treeCount > 1 ? "s" : ""} Planted
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600">
                            Certificate: {tree.certificateId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Location: {tree.plantingLocation}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              tree.status === "confirmed"
                                ? "bg-yellow-100 text-yellow-800"
                                : tree.status === "planted"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {tree.status.charAt(0).toUpperCase() +
                              tree.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {metadata.carbonOffset && (
                        <p className="text-sm text-green-700 mb-2">
                          Carbon offset: {metadata.carbonOffset}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(tree.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-green-600 font-medium">
                          -{tree.tokensCost} tokens
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
