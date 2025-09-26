"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  IconArrowLeft,
  IconStar,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";

interface TripDetailPageProps {
  params: {
    tripId: string;
  };
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { tripId } = params;

  const handleBack = () => {
    router.back();
  };

  const handleStartTrip = () => {
    // For now, just go back, but this could navigate to a trip start page
    handleBack();
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
                Trip Details
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🎭
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Trip #{tripId}
            </h2>
            <p className="text-gray-600 mb-6">
              Detailed trip information will be implemented here.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <IconClock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">2h 30m</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <IconStar className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">4.8</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <IconMapPin className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Stops</p>
                <p className="font-medium">5</p>
              </div>
            </div>

            <button
              onClick={() => requireAuth(handleStartTrip)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
