"use client";

import { useState, useEffect } from "react";
import { IconCoins } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

export default function TokenDisplay() {
  const { user, isAuthenticated } = useAuth();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchTokenBalance = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch("/api/tokens?limit=1");
      const data = await response.json();

      if (data.success) {
        setTokenBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenBalance();
  }, [isAuthenticated]);

  // Refresh token balance when component receives focus (for updates after reviews)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchTokenBalance();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated]);

  // Expose refresh function globally for other components to trigger updates
  useEffect(() => {
    (window as any).refreshTokenBalance = fetchTokenBalance;
    return () => {
      delete (window as any).refreshTokenBalance;
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200">
      <IconCoins className="w-4 h-4" />
      <span className="text-sm font-medium">
        {loading ? "..." : tokenBalance.toLocaleString()}
      </span>
    </div>
  );
}
