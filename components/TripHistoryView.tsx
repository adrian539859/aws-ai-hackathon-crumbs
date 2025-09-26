"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  IconClock,
  IconStar,
  IconCalendar,
  IconMapPin,
  IconPlayerPlay,
  IconCheck,
  IconCoins,
  IconCar,
  IconWalk,
  IconBike,
  IconEye,
  IconWheelchair,
  IconSearch,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";
import type { UserTrip } from "@/lib/types";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "unlocked":
      return "bg-blue-50 text-blue-700";
    case "started":
      return "bg-yellow-50 text-yellow-700";
    case "completed":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "unlocked":
      return IconMapPin;
    case "started":
      return IconPlayerPlay;
    case "completed":
      return IconCheck;
    default:
      return IconMapPin;
  }
};

export default function TripHistoryView() {
  const { user, requireAuth } = useAuth();
  const [userTrips, setUserTrips] = useState<UserTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserTrips = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedStatus !== "all") {
          params.append("status", selectedStatus);
        }
        params.append("limit", "50");

        const response = await fetch(`/api/user/trips?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch user trips");

        const data = await response.json();
        setUserTrips(data.userTrips || []);
      } catch (error) {
        console.error("Error fetching user trips:", error);
        setUserTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTrips();
  }, [user, selectedStatus]);

  const handleTripSelect = (tripId: string) => {
    // Open trip detail in a new tab/window or navigate
    window.open(`/trip/${tripId}`, "_blank");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const filteredTrips =
    selectedStatus === "all"
      ? userTrips
      : userTrips.filter((trip) => trip.status === selectedStatus);

  if (!user) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <IconMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sign in to view your trips
              </h3>
              <p className="text-gray-600 mb-4">
                Unlock premium trips and track your journey history
              </p>
              <button
                onClick={() => requireAuth(() => {})}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">
            View and manage your unlocked trip experiences
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "All" },
              { key: "unlocked", label: "Unlocked" },
              { key: "started", label: "Started" },
              { key: "completed", label: "Completed" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === filter.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trip History */}
        <div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <IconSearch className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No trips found
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedStatus === "all"
                  ? "You haven't unlocked any trips yet. Explore and unlock premium trips to see them here."
                  : `You don't have any ${selectedStatus} trips yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((userTrip) => {
                const trip = userTrip.trip!;
                const StatusIcon = getStatusIcon(userTrip.status);

                return (
                  <div
                    key={userTrip.id}
                    onClick={() => handleTripSelect(trip.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="relative">
                      <ShineBorder
                        className="rounded-xl"
                        shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                        borderWidth={1}
                        duration={12}
                      />

                      <div className="p-4">
                        <div className="flex gap-3">
                          {/* Trip Image Placeholder */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-xl">
                            {getCategoryEmoji(trip.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                                {trip.name}
                              </h3>
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  userTrip.status
                                )}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="capitalize">
                                  {userTrip.status}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                              {trip.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <IconClock className="w-3 h-3" />
                                  <span>{trip.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{trip.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconCoins className="w-3 h-3 text-orange-500" />
                                  <span>{userTrip.tokensSpent}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                {trip.transportMode.slice(0, 2).map((mode) => {
                                  const Icon = getTransportIcon(mode);
                                  return (
                                    <Icon
                                      key={mode}
                                      className="w-3 h-3 text-gray-400"
                                    />
                                  );
                                })}
                                {trip.accessibility.visuallyImpaired && (
                                  <IconEye className="w-3 h-3 text-purple-500" />
                                )}
                                {trip.accessibility.wheelchairAccessible && (
                                  <IconWheelchair className="w-3 h-3 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Trip Details */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <IconCalendar className="w-3 h-3" />
                              <span>
                                Unlocked: {formatDate(userTrip.unlockedAt)}
                              </span>
                            </div>
                            {userTrip.status === "started" &&
                              userTrip.startedAt && (
                                <div className="flex items-center gap-1">
                                  <IconPlayerPlay className="w-3 h-3" />
                                  <span>
                                    Started: {formatDate(userTrip.startedAt)}
                                  </span>
                                </div>
                              )}
                            {userTrip.status === "completed" &&
                              userTrip.completedAt && (
                                <div className="flex items-center gap-1">
                                  <IconCheck className="w-3 h-3" />
                                  <span>
                                    Completed:{" "}
                                    {formatDate(userTrip.completedAt)}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
