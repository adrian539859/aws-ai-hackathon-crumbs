CREATE TABLE "trips" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"duration" text NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"reviewCount" integer DEFAULT 0 NOT NULL,
	"isPremium" boolean DEFAULT false NOT NULL,
	"isLocked" boolean DEFAULT false NOT NULL,
	"tokenCost" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"transportMode" text NOT NULL,
	"accessibility" text NOT NULL,
	"imageUrl" text,
	"itinerary" text NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTrips" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"tripId" text NOT NULL,
	"unlockedAt" timestamp DEFAULT now() NOT NULL,
	"tokensSpent" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'unlocked' NOT NULL,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"progress" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userTrips" ADD CONSTRAINT "userTrips_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userTrips" ADD CONSTRAINT "userTrips_tripId_trips_id_fk" FOREIGN KEY ("tripId") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;