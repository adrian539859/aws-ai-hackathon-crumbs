export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  imageUrl?: string;
  openingHours?: string;
  priceRange?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id: string;
  attractionId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  isVerified: boolean;
  tokensEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  attractionId: string;
  rating: number;
  title?: string;
  content: string;
}

export interface TokenHistory {
  id: string;
  userId: string;
  amount: number; // positive for earned, negative for spent
  type: "earned" | "spent" | "bonus" | "refund";
  source: "review" | "signup" | "purchase" | "admin" | string;
  sourceId?: string; // reference to review id, purchase id, etc.
  description: string;
  metadata?: string; // JSON string for additional data
  createdAt: Date;
}

export interface CreateTokenHistoryRequest {
  userId: string;
  amount: number;
  type: "earned" | "spent" | "bonus" | "refund";
  source: string;
  sourceId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessAddress: string;
  discountType: "percentage" | "fixed_amount" | "bogo";
  discountValue: number; // percentage or fixed amount in cents
  originalPrice?: number; // original price in cents
  finalPrice?: number; // final price in cents
  tokenCost: number; // cost in tokens to redeem
  category: "food" | "shopping" | "entertainment" | "services";
  imageUrl?: string;
  terms?: string; // terms and conditions
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  maxRedemptions?: number; // null for unlimited
  currentRedemptions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  redemptionCode: string; // unique code for the user to show at the store
  isUsed: boolean;
  usedAt?: Date;
  redeemedAt: Date;
  expiresAt: Date;
  // Joined coupon data
  coupon?: Coupon;
}

export interface RedeemCouponRequest {
  couponId: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "2h 30m"
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isLocked: boolean;
  tokenCost: number; // cost in tokens to unlock
  category: "restaurant" | "shopping" | "entertainment" | "nature" | "culture";
  transportMode: string[]; // array of transport modes
  accessibility: {
    visuallyImpaired: boolean;
    wheelchairAccessible: boolean;
  };
  imageUrl?: string;
  itinerary: TripStop[]; // array of stops/attractions
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripStop {
  id: string;
  name: string;
  description: string;
  duration: string;
  location: string;
  category: string;
  order: number;
  // Transportation to next stop (null for last stop)
  nextTransport?: {
    method: "walk" | "car" | "bike" | "bus" | "mtr" | "taxi" | "tram";
    duration: string; // e.g., "5m", "15m"
    distance?: string; // e.g., "0.3km", "1.2km"
    instructions?: string; // e.g., "Head north on Queen's Road"
  } | null;
}

export interface UserTrip {
  id: string;
  userId: string;
  tripId: string;
  unlockedAt: Date;
  tokensSpent: number; // tokens spent to unlock
  status: "unlocked" | "started" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  progress?: Record<string, any>; // JSON to track progress through the trip
  createdAt: Date;
  updatedAt: Date;
  // Joined trip data
  trip?: Trip;
}

export interface UnlockTripRequest {
  tripId: string;
}
