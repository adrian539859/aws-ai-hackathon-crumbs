"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import SearchTrigger from "./SearchTrigger";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
const createDefaultIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Create user location icon (orange color)
const createUserIcon = () => {
  return L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Component to handle map updates when position changes
function MapUpdater({
  center,
  hasUserLocation,
}: {
  center: [number, number];
  hasUserLocation: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    // Use higher zoom level when user location is available
    const zoomLevel = hasUserLocation ? 16 : 13;
    map.setView(center, zoomLevel);
  }, [center, map, hasUserLocation]);

  return null;
}

interface MapViewProps {
  className?: string;
}

type Position = {
  lat: number;
  lng: number;
  accuracy?: number;
};

export default function MapView({ className = "" }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    // Set default icon when component mounts
    L.Marker.prototype.options.icon = createDefaultIcon();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }

          setLocationError(errorMessage);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
      setIsLocating(false);
    }
  }, []);

  // Default center (Hong Kong) if no user location
  const defaultCenter: [number, number] = [22.3193, 114.1694];
  const center: [number, number] = userPosition
    ? [userPosition.lat, userPosition.lng]
    : defaultCenter;

  return (
    <div
      className={`w-full h-full rounded-xl overflow-hidden relative ${className}`}
    >
      {/* Search Trigger - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <SearchTrigger />
      </div>

      {/* Loading indicator */}
      {isLocating && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Locating you...
          </div>
        </div>
      )}

      {/* Location error indicator */}
      {locationError && (
        <div className="absolute top-4 left-4 z-10 bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {locationError}
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        ref={mapRef}
      >
        <MapUpdater center={center} hasUserLocation={!!userPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {/* User location marker */}
        {userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={createUserIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">Your Location</h3>
                <p className="text-gray-600">You are here!</p>
                {userPosition.accuracy && (
                  <p className="text-xs text-gray-500 mt-1">
                    Accuracy: ±{Math.round(userPosition.accuracy)}m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Default marker (only show if no user location) */}
        {!userPosition && !isLocating && (
          <Marker position={defaultCenter}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">Hong Kong</h3>
                <p className="text-gray-600">
                  Default location - enable location access to see your
                  position!
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
