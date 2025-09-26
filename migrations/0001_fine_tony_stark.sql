CREATE TABLE "coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"businessName" text NOT NULL,
	"businessAddress" text NOT NULL,
	"discountType" text NOT NULL,
	"discountValue" integer NOT NULL,
	"originalPrice" integer,
	"finalPrice" integer,
	"tokenCost" integer NOT NULL,
	"category" text NOT NULL,
	"imageUrl" text,
	"terms" text,
	"validFrom" timestamp DEFAULT now() NOT NULL,
	"validUntil" timestamp NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"maxRedemptions" integer,
	"currentRedemptions" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userCoupons" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"couponId" text NOT NULL,
	"redemptionCode" text NOT NULL,
	"isUsed" boolean DEFAULT false NOT NULL,
	"usedAt" timestamp,
	"redeemedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL,
	CONSTRAINT "userCoupons_redemptionCode_unique" UNIQUE("redemptionCode")
);
--> statement-breakpoint
ALTER TABLE "userCoupons" ADD CONSTRAINT "userCoupons_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userCoupons" ADD CONSTRAINT "userCoupons_couponId_coupons_id_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;