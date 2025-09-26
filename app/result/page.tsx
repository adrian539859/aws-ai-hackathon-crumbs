"use client";

import { useEffect, useState, Suspense } from "react";
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
  IconCoins,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { useAuth } from "@/hooks/useAuth";
import type { Trip } from "@/lib/types";

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

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockingTrip, setUnlockingTrip] = useState<string | null>(null);
  const [userTrips, setUserTrips] = useState<string[]>([]); // Track user's unlocked trips

  // Get search parameters
  const destination = searchParams.get("destination") || "Tai Kwun";
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "16:00";
  const activity = searchParams.get("activity") || "entertainment";
  const transportMode = searchParams.get("transport") || "car";
  const visuallyImpaired = searchParams.get("visuallyImpaired") === "true";
  const wheelchairAccess = searchParams.get("wheelchairAccess") === "true";

  // Fetch user's unlocked trips
  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/trips");
        if (response.ok) {
          const data = await response.json();
          const tripIds =
            data.userTrips?.map((userTrip: any) => userTrip.tripId) || [];
          setUserTrips(tripIds);
        }
      } catch (error) {
        console.error("Error fetching user trips:", error);
      }
    };

    fetchUserTrips();
  }, [user]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (activity && activity !== "") params.append("category", activity);
        if (transportMode) params.append("transport", transportMode);
        if (visuallyImpaired) params.append("visuallyImpaired", "true");
        if (wheelchairAccess) params.append("wheelchairAccess", "true");
        if (destination) params.append("destination", destination);
        params.append("limit", "30");

        const response = await fetch(`/api/trips?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch trips");

        const data = await response.json();
        setFilteredTrips(data.trips || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setFilteredTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [
    activity,
    transportMode,
    visuallyImpaired,
    wheelchairAccess,
    destination,
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleUnlockTrip = async (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      requireAuth(() => handleUnlockTrip(trip, e));
      return;
    }

    // If trip is not locked, handle as trip selection
    if (!trip.isLocked) {
      handleTripSelect(trip.id);
      return;
    }

    try {
      setUnlockingTrip(trip.id);

      const response = await fetch("/api/trips/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId: trip.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to unlock trip");
        return;
      }

      const result = await response.json();
      alert(
        `Trip unlocked! You spent ${result.tokensSpent} tokens. Remaining balance: ${result.newBalance}`
      );

      // Update the trip in the local state
      setFilteredTrips((prev) =>
        prev.map((t) => (t.id === trip.id ? { ...t, isLocked: false } : t))
      );

      // Add trip to user's unlocked trips
      setUserTrips((prev) => [...prev, trip.id]);

      // Navigate to history view to see the unlocked trip
      router.push("/history");
    } catch (error) {
      console.error("Error unlocking trip:", error);
      alert("Failed to unlock trip. Please try again.");
    } finally {
      setUnlockingTrip(null);
    }
  };

  const handleFreeUnlock = async (trip: Trip) => {
    console.log("handleFreeUnlock called for trip:", trip.name);
    if (!user) {
      requireAuth(() => handleFreeUnlock(trip));
      return;
    }

    try {
      // For free trips, we'll create a user trip record directly via API
      const response = await fetch("/api/user/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id,
          tokensSpent: 0,
          status: "unlocked",
        }),
      });

      if (response.ok) {
        // Add trip to user's unlocked trips
        setUserTrips((prev) => [...prev, trip.id]);

        // Show success message
        alert(`${trip.name} has been added to your collection!`);

        // Navigate to history view
        router.push("/history");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(
          `Failed to unlock trip: ${errorData.error || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error unlocking free trip:", error);
      alert("Failed to unlock trip. Please try again.");
    }
  };

  const handleTripSelect = (tripId: string) => {
    console.log("handleTripSelect called for trip:", tripId);
    if (!user) {
      requireAuth(() => handleTripSelect(tripId));
      return;
    }

    // Check if user has this trip unlocked using local state
    const hasTrip = userTrips.includes(tripId);
    console.log("User has trip:", hasTrip, "userTrips:", userTrips);

    if (hasTrip) {
      // User already has this trip, redirect to history
      router.push("/history");
    } else {
      // Trip not unlocked yet, show message
      alert(
        "This trip needs to be unlocked first. Please unlock it to access the details."
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
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
      </div>

      {/* Results */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
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
                                {trip.isPremium &&
                                !userTrips.includes(trip.id) ? (
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
                                  <span>{trip.rating.toFixed(2)}</span>
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
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                              const isUnlocked = userTrips.includes(trip.id);
                              if (isUnlocked) {
                                // Already unlocked, start journey
                                handleTripSelect(trip.id);
                              } else if (trip.isLocked) {
                                // Premium locked trip, requires tokens
                                handleUnlockTrip(trip, e);
                              } else {
                                // Free trip, unlock for free
                                handleFreeUnlock(trip);
                              }
                            }}
                            disabled={unlockingTrip === trip.id}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                              trip.isPremium &&
                              trip.isLocked &&
                              !userTrips.includes(trip.id)
                                ? "bg-orange-50 text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            {unlockingTrip === trip.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Unlocking...
                              </>
                            ) : trip.isPremium &&
                              trip.isLocked &&
                              !userTrips.includes(trip.id) ? (
                              <>
                                <IconCoins className="w-4 h-4" />
                                Unlock Trip ({trip.tokenCost} tokens)
                              </>
                            ) : userTrips.includes(trip.id) ? (
                              "Start Journey"
                            ) : (
                              "Add to Collection"
                            )}
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

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
