"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FloatingDock } from "@/components/ui/floating-dock";
import ExploreView from "@/components/ExploreView";
import AccountView from "@/components/AccountView";
import CouponView from "@/components/CouponView";
import { useAuth } from "@/hooks/useAuth";
import {
  IconHome,
  IconCompass,
  IconUser,
  IconTicket,
} from "@tabler/icons-react";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse" />
  ),
});

type ViewType = "home" | "explore" | "coupons" | "account";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const { requireAuth } = useAuth();

  const handleNavigation = (view: ViewType) => {
    // Require authentication for coupons and account pages
    if (view === "coupons" || view === "account") {
      requireAuth(() => setCurrentView(view));
    } else {
      setCurrentView(view);
    }
  };

  const dockItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full" />,
      href: "#home",
      onClick: () => handleNavigation("home"),
    },
    {
      title: "Explore",
      icon: <IconCompass className="h-full w-full" />,
      href: "#explore",
      onClick: () => handleNavigation("explore"),
    },
    {
      title: "Coupons",
      icon: <IconTicket className="h-full w-full" />,
      href: "#coupons",
      onClick: () => handleNavigation("coupons"),
    },
    {
      title: "Account",
      icon: <IconUser className="h-full w-full" />,
      href: "#account",
      onClick: () => handleNavigation("account"),
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="w-full h-full">
            <MapView className="h-full" />
          </div>
        );
      case "explore":
        return <ExploreView />;
      case "coupons":
        return <CouponView />;
      case "account":
        return <AccountView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigation("home")}
            className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Crumbs
          </button>
          <div className="text-sm text-gray-500 capitalize">{currentView}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-[calc(100vh-100px)] w-full">{renderContent()}</div>
      </main>

      {/* Floating Dock */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock
          items={dockItems}
          desktopClassName="bg-gray-900/90 backdrop-blur-md border border-gray-700"
          mobileClassName="bg-gray-900/90 backdrop-blur-md border border-gray-700"
        />
      </div>
    </div>
  );
}
