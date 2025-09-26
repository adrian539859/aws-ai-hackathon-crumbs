import {
  integer,
  text,
  boolean,
  pgTable,
  timestamp,
  primaryKey,
  real,
  uuid,
} from "drizzle-orm/pg-core";

// Better Auth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Attractions table
export const attractions = pgTable("attractions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("reviewCount").notNull().default(0),
  category: text("category").notNull(),
  imageUrl: text("imageUrl"),
  openingHours: text("openingHours"),
  priceRange: text("priceRange"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  attractionId: text("attractionId")
    .notNull()
    .references(() => attractions.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  isVerified: boolean("isVerified").notNull().default(false),
  tokensEarned: integer("tokensEarned").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Token history table - append-only design for tracking all token transactions
export const tokenHistory = pgTable("tokenHistory", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // positive for earned, negative for spent
  type: text("type").notNull(), // 'earned', 'spent', 'bonus', 'refund'
  source: text("source").notNull(), // 'review', 'signup', 'purchase', 'admin', etc.
  sourceId: text("sourceId"), // reference to review id, purchase id, etc.
  description: text("description").notNull(),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  businessName: text("businessName").notNull(),
  businessAddress: text("businessAddress").notNull(),
  discountType: text("discountType").notNull(), // 'percentage', 'fixed_amount', 'bogo'
  discountValue: integer("discountValue").notNull(), // percentage or fixed amount in cents
  originalPrice: integer("originalPrice"), // original price in cents (optional)
  finalPrice: integer("finalPrice"), // final price in cents (optional)
  tokenCost: integer("tokenCost").notNull(), // cost in tokens to redeem
  category: text("category").notNull(), // 'food', 'shopping', 'entertainment', 'services'
  imageUrl: text("imageUrl"),
  terms: text("terms"), // terms and conditions
  validFrom: timestamp("validFrom").notNull().defaultNow(),
  validUntil: timestamp("validUntil").notNull(),
  isActive: boolean("isActive").notNull().default(true),
  maxRedemptions: integer("maxRedemptions"), // null for unlimited
  currentRedemptions: integer("currentRedemptions").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// User coupon redemptions table
export const userCoupons = pgTable("userCoupons", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  couponId: text("couponId")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),
  redemptionCode: text("redemptionCode").notNull().unique(), // unique code for the user to show at the store
  isUsed: boolean("isUsed").notNull().default(false),
  usedAt: timestamp("usedAt"),
  redeemedAt: timestamp("redeemedAt").notNull().defaultNow(),
  expiresAt: timestamp("expiresAt").notNull(),
});

// Tree planting donations table for ESG initiative
export const treePlantings = pgTable("treePlantings", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  tokensCost: integer("tokensCost").notNull().default(10), // cost in tokens (10 tokens per tree)
  treeCount: integer("treeCount").notNull().default(1), // number of trees planted
  certificateId: text("certificateId").notNull().unique(), // unique certificate ID for the donation
  plantingLocation: text("plantingLocation").notNull().default("Hong Kong Reforestation Initiative"), // where the tree is planted
  status: text("status").notNull().default("confirmed"), // 'confirmed', 'planted', 'verified'
  metadata: text("metadata"), // JSON string for additional data (e.g., tree species, coordinates)
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

