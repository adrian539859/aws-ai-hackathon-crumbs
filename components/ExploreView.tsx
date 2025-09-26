"use client";

import { useState, useEffect } from "react";
import { IconStar, IconMapPin, IconClock, IconEdit } from "@tabler/icons-react";
import { Attraction } from "@/lib/types";
import ReviewDialog from "./ReviewDialog";

export default function ExploreView() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch attractions from API
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch("/api/attractions");
        const data = await response.json();

        if (data.success) {
          setAttractions(data.attractions);
        } else {
          setError("Failed to load attractions");
        }
      } catch (err) {
        console.error("Error fetching attractions:", err);
        setError("Failed to load attractions");
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  const handleReview = (attractionId: string, attractionName: string) => {
    setSelectedAttraction({ id: attractionId, name: attractionName });
  };

  const handleReviewSubmitted = (success: boolean, message: string) => {
    setNotification({ type: success ? "success" : "error", message });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);

    // Refresh attractions to update rating/review count
    if (success) {
      const fetchAttractions = async () => {
        try {
          const response = await fetch("/api/attractions");
          const data = await response.json();
          if (data.success) {
            setAttractions(data.attractions);
          }
        } catch (err) {
          console.error("Error refreshing attractions:", err);
        }
      };
      fetchAttractions();
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <IconStar
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IconStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attractions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Hong Kong
          </h2>
          <p className="text-gray-600">
            Discover amazing attractions and share your experiences to earn
            tokens
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <IconMapPin className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Image placeholder</span>
                </div>
              </div>

              <div className="p-4">
                {/* Header */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                    {attraction.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(attraction.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {attraction.rating} (
                      {attraction.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <IconMapPin className="w-4 h-4 mr-1" />
                    {attraction.location}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {attraction.description}
                </p>

                {/* Category and Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {attraction.category}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {attraction.priceRange}
                  </span>
                </div>

                {/* Opening Hours */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <IconClock className="w-4 h-4 mr-1" />
                  {attraction.openingHours}
                </div>

                {/* Review Button */}
                <button
                  onClick={() => handleReview(attraction.id, attraction.name)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <IconEdit className="w-4 h-4" />
                  Write Review & Earn Tokens
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Dialog */}
      {selectedAttraction && (
        <ReviewDialog
          isOpen={!!selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
          attractionId={selectedAttraction.id}
          attractionName={selectedAttraction.name}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
