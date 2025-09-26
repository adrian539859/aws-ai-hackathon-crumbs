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
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  source: 'review' | 'signup' | 'purchase' | 'admin' | string;
  sourceId?: string; // reference to review id, purchase id, etc.
  description: string;
  metadata?: string; // JSON string for additional data
  createdAt: Date;
}

export interface CreateTokenHistoryRequest {
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  source: string;
  sourceId?: string;
  description: string;
  metadata?: Record<string, any>;
}
