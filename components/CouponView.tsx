"use client";

import { useState, useEffect } from "react";
import { Coupon, UserCoupon } from "@/lib/types";
import {
  IconGift,
  IconCoin,
  IconMapPin,
  IconClock,
  IconCheck,
  IconX,
  IconTicket,
  IconShoppingBag,
  IconToolsKitchen2,
  IconDeviceGamepad2,
  IconTool,
} from "@tabler/icons-react";

interface CouponViewProps {
  className?: string;
}

type TabType = "available" | "my-coupons";

export default function CouponView({ className = "" }: CouponViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    tokenBalance: 0,
    reviewsCount: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All", icon: IconGift },
    { id: "food", label: "Food", icon: IconToolsKitchen2 },
    { id: "shopping", label: "Shopping", icon: IconShoppingBag },
    { id: "entertainment", label: "Entertainment", icon: IconDeviceGamepad2 },
    { id: "services", label: "Services", icon: IconTool },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user stats
      const statsResponse = await fetch("/api/user/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData.stats);
      }

      if (activeTab === "available") {
        // Fetch available coupons
        const categoryParam =
          selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
        const response = await fetch(`/api/coupons${categoryParam}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableCoupons(data.coupons);
        }
      } else {
        // Fetch user's coupons
        const response = await fetch("/api/user/coupons");
        if (response.ok) {
          const data = await response.json();
          setMyCoupons(data.coupons);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemCoupon = async (couponId: string) => {
    setRedeeming(couponId);
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh data after successful redemption
        fetchData();
        alert(
          "Coupon redeemed successfully! Check 'My Coupons' tab to view your redemption code."
        );
      } else {
        alert(data.error || "Failed to redeem coupon");
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      alert("Failed to redeem coupon");
    } finally {
      setRedeeming(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `HK$${(cents / 100).toFixed(2)}`;
  };

  const formatDiscount = (coupon: Coupon) => {
    switch (coupon.discountType) {
      case "percentage":
        return `${coupon.discountValue}% OFF`;
      case "fixed_amount":
        return `HK$${(coupon.discountValue / 100).toFixed(2)} OFF`;
      case "bogo":
        return "Buy 1 Get 1 FREE";
      default:
        return "Special Offer";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((c) => c.id === category);
    const IconComponent = categoryData?.icon || IconGift;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCouponStatus = (userCoupon: UserCoupon) => {
    if (userCoupon.isUsed) return "used";
    if (new Date() > userCoupon.expiresAt) return "expired";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "used":
        return "text-gray-500";
      case "expired":
        return "text-red-500";
      case "active":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "used":
        return <IconCheck className="h-4 w-4" />;
      case "expired":
        return <IconX className="h-4 w-4" />;
      case "active":
        return <IconTicket className="h-4 w-4" />;
      default:
        return <IconTicket className="h-4 w-4" />;
    }
  };

  const renderAvailableCoupons = () => (
    <div className="space-y-6">
      {/* Token Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Your Token Balance</p>
            <p className="text-2xl font-bold">{userStats.tokenBalance}</p>
          </div>
          <IconCoin className="h-8 w-8 opacity-80" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Available Coupons */}
      <div className="grid gap-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : availableCoupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <IconGift className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No coupons available in this category</p>
          </div>
        ) : (
          availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(coupon.category)}
                    <h3 className="font-semibold text-gray-900">
                      {coupon.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {coupon.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IconMapPin className="h-4 w-4" />
                    <span>{coupon.businessName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium mb-2">
                    {formatDiscount(coupon)}
                  </div>
                  {coupon.originalPrice && coupon.finalPrice && (
                    <div className="text-sm">
                      <span className="line-through text-gray-400">
                        {formatPrice(coupon.originalPrice)}
                      </span>
                      <span className="ml-1 font-semibold text-green-600">
                        {formatPrice(coupon.finalPrice)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <IconClock className="h-4 w-4" />
                    <span>
                      Expires {new Date(coupon.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  {coupon.maxRedemptions && (
                    <span>
                      {coupon.maxRedemptions - coupon.currentRedemptions} left
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRedeemCoupon(coupon.id)}
                  disabled={
                    redeeming === coupon.id ||
                    userStats.tokenBalance < coupon.tokenCost
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    userStats.tokenBalance < coupon.tokenCost
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : redeeming === coupon.id
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <IconCoin className="h-4 w-4" />
                  {redeeming === coupon.id
                    ? "Redeeming..."
                    : `${coupon.tokenCost} Tokens`}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderMyCoupons = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : myCoupons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <IconTicket className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>You haven't redeemed any coupons yet</p>
          <button
            onClick={() => setActiveTab("available")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Available Coupons
          </button>
        </div>
      ) : (
        myCoupons.map((userCoupon) => {
          const status = getCouponStatus(userCoupon);
          const coupon = userCoupon.coupon!;

          return (
            <div
              key={userCoupon.id}
              className={`bg-white border rounded-xl p-4 shadow-sm ${
                status === "expired" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(coupon.category)}
                    <h3 className="font-semibold text-gray-900">
                      {coupon.title}
                    </h3>
                    <div
                      className={`flex items-center gap-1 text-sm ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {coupon.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IconMapPin className="h-4 w-4" />
                    <span>{coupon.businessName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                    {formatDiscount(coupon)}
                  </div>
                </div>
              </div>

              {status === "active" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Redemption Code
                  </p>
                  <p className="text-lg font-mono font-bold text-green-900">
                    {userCoupon.redemptionCode}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Show this code at {coupon.businessName}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
                <span>
                  Redeemed{" "}
                  {new Date(userCoupon.redeemedAt).toLocaleDateString()}
                </span>
                <span>
                  Expires {new Date(userCoupon.expiresAt).toLocaleDateString()}
                </span>
              </div>

              {coupon.terms && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <strong>Terms:</strong> {coupon.terms}
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className={`w-full h-full overflow-y-auto ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconCoin className="h-4 w-4" />
            <span>{userStats.tokenBalance} tokens</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "available"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Available Coupons
          </button>
          <button
            onClick={() => setActiveTab("my-coupons")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "my-coupons"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Coupons
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "available"
            ? renderAvailableCoupons()
            : renderMyCoupons()}
        </div>
      </div>
    </div>
  );
}
