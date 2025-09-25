"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconClock,
  IconMapPin,
  IconLock,
  IconLockOpen,
  IconStar,
  IconUsers,
  IconCar,
  IconWalk,
  IconBike,
  IconEye,
  IconWheelchair,
  IconCalendar,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";

interface Trip {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isLocked: boolean;
  category: string;
  accessibility: {
    visuallyImpaired: boolean;
    wheelchairAccessible: boolean;
  };
  transportMode: string[];
  imageUrl: string;
}

// Mock trip data - in a real app this would come from an API
const mockTrips: Trip[] = [
  {
    id: "1",
    name: "Central Heritage Walk",
    description: "Explore historic Central district with guided audio tour",
    duration: "2h 30m",
    rating: 4.8,
    reviewCount: 124,
    isPremium: false,
    isLocked: false,
    category: "culture",
    accessibility: {
      visuallyImpaired: true,
      wheelchairAccessible: true,
    },
    transportMode: ["walk"],
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "2",
    name: "Tai Kwun Art Discovery",
    description: "Contemporary art galleries and historic police station",
    duration: "1h 45m",
    rating: 4.6,
    reviewCount: 89,
    isPremium: false,
    isLocked: false,
    category: "entertainment",
    accessibility: {
      visuallyImpaired: false,
      wheelchairAccessible: true,
    },
    transportMode: ["walk", "car"],
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "3",
    name: "Premium Food Trail",
    description: "Exclusive dining experience with local chef guides",
    duration: "3h 15m",
    rating: 4.9,
    reviewCount: 67,
    isPremium: true,
    isLocked: true,
    category: "restaurant",
    accessibility: {
      visuallyImpaired: false,
      wheelchairAccessible: false,
    },
    transportMode: ["car", "walk"],
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "4",
    name: "Nature Photography Tour",
    description: "Capture stunning landscapes in Hong Kong's nature reserves",
    duration: "4h 00m",
    rating: 4.7,
    reviewCount: 156,
    isPremium: false,
    isLocked: false,
    category: "nature",
    accessibility: {
      visuallyImpaired: false,
      wheelchairAccessible: false,
    },
    transportMode: ["car", "bike"],
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "5",
    name: "Shopping District Explorer",
    description: "Discover hidden gems in bustling shopping areas",
    duration: "2h 15m",
    rating: 4.5,
    reviewCount: 203,
    isPremium: false,
    isLocked: false,
    category: "shopping",
    accessibility: {
      visuallyImpaired: true,
      wheelchairAccessible: true,
    },
    transportMode: ["walk", "car"],
    imageUrl: "/api/placeholder/300/200",
  },
  {
    id: "6",
    name: "Premium Cultural Experience",
    description: "VIP access to museums and cultural sites",
    duration: "5h 30m",
    rating: 4.9,
    reviewCount: 45,
    isPremium: true,
    isLocked: true,
    category: "culture",
    accessibility: {
      visuallyImpaired: true,
      wheelchairAccessible: true,
    },
    transportMode: ["car"],
    imageUrl: "/api/placeholder/300/200",
  },
];

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case "car":
      return IconCar;
    case "walk":
      return IconWalk;
    case "bike":
      return IconBike;
    default:
      return IconWalk;
  }
};

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case "restaurant":
      return "🍽️";
    case "shopping":
      return "🛍️";
    case "entertainment":
      return "🎭";
    case "nature":
      return "🏞️";
    case "culture":
      return "🎨";
    default:
      return "📍";
  }
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get search parameters
  const destination = searchParams.get("destination") || "Tai Kwun";
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "16:00";
  const activity = searchParams.get("activity") || "entertainment";
  const transportMode = searchParams.get("transport") || "car";
  const visuallyImpaired = searchParams.get("visuallyImpaired") === "true";
  const wheelchairAccess = searchParams.get("wheelchairAccess") === "true";

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = [...mockTrips];

      // Filter by activity/category
      if (activity && activity !== "") {
        filtered = filtered.filter((trip) => trip.category === activity);
      }

      // Filter by transport mode
      if (transportMode) {
        filtered = filtered.filter((trip) =>
          trip.transportMode.includes(transportMode)
        );
      }

      // Filter by accessibility needs
      if (visuallyImpaired) {
        filtered = filtered.filter(
          (trip) => trip.accessibility.visuallyImpaired
        );
      }

      if (wheelchairAccess) {
        filtered = filtered.filter(
          (trip) => trip.accessibility.wheelchairAccessible
        );
      }

      // Sort by rating (highest first)
      filtered.sort((a, b) => b.rating - a.rating);

      setFilteredTrips(filtered);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [activity, transportMode, visuallyImpaired, wheelchairAccess]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleTripSelect = (tripId: string) => {
    // Navigate to trip detail page (to be implemented)
    router.push(`/trip/${tripId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IconArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {destination}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconCalendar className="w-4 h-4" />
                <span>{formatDate(date)}</span>
                <IconClock className="w-4 h-4 ml-2" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {activity && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <span>{getCategoryEmoji(activity)}</span>
              <span className="capitalize">{activity}</span>
            </div>
          )}
          {transportMode && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              {(() => {
                const Icon = getTransportIcon(transportMode);
                return <Icon className="w-3 h-3" />;
              })()}
              <span className="capitalize">{transportMode}</span>
            </div>
          )}
          {visuallyImpaired && (
            <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
              <IconEye className="w-3 h-3" />
              <span>Audio Guide</span>
            </div>
          )}
          {wheelchairAccess && (
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
              <IconWheelchair className="w-3 h-3" />
              <span>Accessible</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredTrips.length} trip
                {filteredTrips.length !== 1 ? "s" : ""} found
              </h2>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <IconMapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or explore different
                  activities.
                </p>
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Modify Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleTripSelect(trip.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="relative">
                      <ShineBorder
                        className="rounded-xl"
                        shineColor={
                          trip.isPremium
                            ? ["#FFD700", "#FFA500", "#FF6347"]
                            : ["#A07CFE", "#FE8FB5", "#FFBE7B"]
                        }
                        borderWidth={trip.isPremium ? 2 : 1}
                        duration={trip.isPremium ? 6 : 12}
                      />

                      <div className="p-4">
                        <div className="flex gap-4">
                          {/* Trip Image Placeholder */}
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                            {getCategoryEmoji(trip.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {trip.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                {trip.isPremium ? (
                                  <IconLock className="w-4 h-4 text-orange-500" />
                                ) : (
                                  <IconLockOpen className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {trip.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <IconClock className="w-4 h-4" />
                                  <span>{trip.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{trip.rating}</span>
                                  <span>({trip.reviewCount})</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {trip.transportMode.slice(0, 2).map((mode) => {
                                  const Icon = getTransportIcon(mode);
                                  return (
                                    <Icon
                                      key={mode}
                                      className="w-4 h-4 text-gray-400"
                                    />
                                  );
                                })}
                                {trip.accessibility.visuallyImpaired && (
                                  <IconEye className="w-4 h-4 text-purple-500" />
                                )}
                                {trip.accessibility.wheelchairAccessible && (
                                  <IconWheelchair className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              trip.isPremium && trip.isLocked
                                ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            {trip.isPremium && trip.isLocked
                              ? "Unlock Trip"
                              : "Start Journey"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
