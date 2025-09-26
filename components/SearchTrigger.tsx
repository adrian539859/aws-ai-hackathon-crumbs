"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconMapPin,
  IconCalendar,
  IconClock,
  IconUsers,
  IconCar,
  IconWalk,
  IconBike,
  IconToolsKitchen2,
  IconShoppingBag,
  IconMask,
  IconTrees,
  IconPalette,
  IconEye,
  IconWheelchair,
  IconSearch,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/ui/shine-border";

interface SearchTriggerProps {
  className?: string;
}

// Helper function to get current time + 4 hours, rounded to nearest 30 minutes
const getDefaultTime = () => {
  const now = new Date();
  // Add 4 hours
  now.setHours(now.getHours() + 4);

  // Round to nearest 30 minutes
  const minutes = now.getMinutes();
  if (minutes <= 15) {
    now.setMinutes(0);
  } else if (minutes <= 45) {
    now.setMinutes(30);
  } else {
    now.setMinutes(0);
    now.setHours(now.getHours() + 1);
  }

  // Format as HH:MM
  return now.toTimeString().slice(0, 5);
};

export default function SearchTrigger({ className = "" }: SearchTriggerProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // Set default values to match old search screen
  const [destination, setDestination] = useState("Tai Kwun");
  const [date, setDate] = useState(new Date()); // Current date
  const [time, setTime] = useState(getDefaultTime()); // Current time + 4 hours, rounded to nearest 30 minutes
  const [travelers, setTravelers] = useState("1");
  const [transportMode, setTransportMode] = useState<"car" | "walk" | "bike">(
    "car"
  );
  const [selectedActivity, setSelectedActivity] = useState("entertainment");
  const [isVisuallyImpaired, setIsVisuallyImpaired] = useState(false);
  const [needsWheelchair, setNeedsWheelchair] = useState(false);

  const transportOptions = [
    { id: "car", icon: IconCar, label: "Driving" },
    { id: "walk", icon: IconWalk, label: "Walking" },
    { id: "bike", icon: IconBike, label: "Cycling" },
  ] as const;

  const activityOptions = [
    { value: "", label: "Choose an activity", icon: null },
    {
      value: "restaurant",
      label: "🍽️ Find Food & Drinks",
      icon: IconToolsKitchen2,
    },
    { value: "shopping", label: "🛍️ Go Shopping", icon: IconShoppingBag },
    { value: "entertainment", label: "🎭 Find Entertainment", icon: IconMask },
    { value: "nature", label: "🏞️ Explore Nature", icon: IconTrees },
    { value: "culture", label: "🎨 Discover Culture", icon: IconPalette },
  ];

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams({
      destination: destination.trim(),
      date: formatDateForInput(date),
      time: time,
      activity: selectedActivity,
      transport: transportMode,
      visuallyImpaired: isVisuallyImpaired.toString(),
      wheelchairAccess: needsWheelchair.toString(),
    });

    // Navigate to result page with search parameters
    router.push(`/result?${params.toString()}`);
    setIsOpen(false);
  };

  // Format date for input display
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => requireAuth(() => setIsOpen(true))}
          className={`cursor-pointer relative bg-background/95 backdrop-blur-sm border border-border rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group overflow-hidden ${className}`}
        >
          <div className="flex items-center gap-3 relative z-10">
            <svg
              className="w-5 h-5 text-primary group-hover:text-primary/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-foreground font-medium whitespace-nowrap">
              Where are you going next?
            </span>
          </div>
          <ShineBorder
            className="rounded-full"
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={2}
            duration={8}
          />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan Your Trip</DialogTitle>
            <DialogDescription>Where would you like to go?</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Next Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <IconMapPin className="w-4 h-4 text-primary" />
                Next Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search location (e.g. Central Park)"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                autoFocus
              />
            </div>

            {/* When do you need to be there? */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-primary" />
                When do you need to be there?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formatDateForInput(date)}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* What would you like to do along the way? */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                What would you like to do along the way?
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              >
                {activityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Needs */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Special Needs
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisuallyImpaired}
                    onChange={(e) => setIsVisuallyImpaired(e.target.checked)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
                  />
                  <div className="flex items-center gap-2">
                    <IconEye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Visually Impaired
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsWheelchair}
                    onChange={(e) => setNeedsWheelchair(e.target.checked)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
                  />
                  <div className="flex items-center gap-2">
                    <IconWheelchair className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Wheelchair Access
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Transport Mode */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Transportation
              </label>
              <div className="grid grid-cols-3 gap-3">
                {transportOptions.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTransportMode(id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      transportMode === id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 text-foreground bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSearch}
              disabled={!destination}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Crumbs!</span>
              <IconSearch className="w-4 h-4" />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
