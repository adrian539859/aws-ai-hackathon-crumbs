"use client";

import { IconStar, IconMapPin, IconClock, IconEdit } from "@tabler/icons-react";
import { mockAttractions } from "@/lib/mockData";

export default function ExploreView() {
  const handleReview = (attractionId: string, attractionName: string) => {
    // Placeholder for review functionality
    alert(
      `Review feature for ${attractionName} - Coming soon! This will help you earn credits.`
    );
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Hong Kong
          </h2>
          <p className="text-gray-600">
            Discover amazing attractions and share your experiences to earn
            credits
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockAttractions.map((attraction) => (
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
                  Write Review & Earn Credits
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
