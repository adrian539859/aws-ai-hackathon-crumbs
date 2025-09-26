"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  IconRoute,
  IconUsers,
  IconX,
  IconBus,
  IconTrain,
  IconArrowRight,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";
import type { UserTrip, TripStop } from "@/lib/types";

interface TripDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userTrip: UserTrip | null;
}

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case "car":
      return IconCar;
    case "walk":
      return IconWalk;
    case "bike":
      return IconBike;
    case "bus":
      return IconBus;
    case "mtr":
      return IconTrain;
    case "taxi":
      return IconCar;
    case "tram":
      return IconTrain;
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
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "started":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TripDetailDialog({
  isOpen,
  onClose,
  userTrip,
}: TripDetailDialogProps) {
  if (!userTrip || !userTrip.trip) return null;

  const trip = userTrip.trip;
  const StatusIcon = getStatusIcon(userTrip.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Trip Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {getCategoryEmoji(trip.category)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {trip.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                {trip.description}
              </DialogDescription>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-3 border ${getStatusColor(
                  userTrip.status
                )}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="capitalize">{userTrip.status}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Stats */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <IconClock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{trip.duration}</p>
              </div>
              <div className="text-center">
                <IconStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold text-gray-900">
                  {trip.rating.toFixed(1)} ({trip.reviewCount})
                </p>
              </div>
              <div className="text-center">
                <IconCoins className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cost</p>
                <p className="font-semibold text-gray-900">
                  {userTrip.tokensSpent} tokens
                </p>
              </div>
              <div className="text-center">
                <IconRoute className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Stops</p>
                <p className="font-semibold text-gray-900">
                  {trip.itinerary?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transport & Accessibility */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <IconCar className="w-5 h-5" />
                Transport & Accessibility
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Transport Modes</p>
                  <div className="flex items-center gap-2">
                    {trip.transportMode.map((mode) => {
                      const Icon = getTransportIcon(mode);
                      return (
                        <div
                          key={mode}
                          className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-medium"
                        >
                          <Icon className="w-3 h-3" />
                          <span className="capitalize">{mode}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Accessibility</p>
                  <div className="flex items-center gap-2">
                    {trip.accessibility.wheelchairAccessible && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                        <IconWheelchair className="w-3 h-3" />
                        <span>Wheelchair Accessible</span>
                      </div>
                    )}
                    {trip.accessibility.visuallyImpaired && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                        <IconEye className="w-3 h-3" />
                        <span>Visually Impaired Friendly</span>
                      </div>
                    )}
                    {!trip.accessibility.wheelchairAccessible &&
                      !trip.accessibility.visuallyImpaired && (
                        <span className="text-sm text-gray-500">
                          No special accessibility features
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Timeline */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <IconCalendar className="w-5 h-5" />
                Trip Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Unlocked
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(userTrip.unlockedAt)}
                    </p>
                  </div>
                </div>
                {userTrip.status === "started" && userTrip.startedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Started
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(userTrip.startedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {userTrip.status === "completed" && userTrip.completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Completed
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDate(userTrip.completedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trip Itinerary */}
          {trip.itinerary && trip.itinerary.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IconMapPin className="w-5 h-5" />
                Trip Itinerary ({trip.itinerary.length} stops)
              </h3>
              <div className="space-y-3">
                {trip.itinerary
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => (
                    <div key={stop.id} className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {stop.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <IconClock className="w-3 h-3" />
                                <span>{stop.duration}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {stop.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <IconMapPin className="w-3 h-3" />
                                <span>{stop.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="capitalize">
                                  {stop.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transportation to Next Stop */}
                      {stop.nextTransport && (
                        <div className="flex items-center justify-center py-2">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {(() => {
                                const TransportIcon = getTransportIcon(
                                  stop.nextTransport.method
                                );
                                return <TransportIcon className="w-4 h-4" />;
                              })()}
                              <span className="capitalize">
                                {stop.nextTransport.method}
                              </span>
                              <IconArrowRight className="w-3 h-3 text-gray-400" />
                              <span className="font-medium">
                                {stop.nextTransport.duration}
                              </span>
                              {stop.nextTransport.distance && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{stop.nextTransport.distance}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transportation Instructions */}
                      {stop.nextTransport?.instructions && (
                        <div className="pl-11">
                          <div className="text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg border-l-2 border-blue-200">
                            <span className="font-medium">Directions:</span>{" "}
                            {stop.nextTransport.instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Trip Information */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {trip.isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mr-2">
                  ⭐ Premium Trip
                </span>
              )}
              Category: <span className="capitalize">{trip.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  userTrip.status
                )}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="capitalize">{userTrip.status}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
