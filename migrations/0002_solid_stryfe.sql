CREATE TABLE "treePlantings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"tokensCost" integer DEFAULT 10 NOT NULL,
	"treeCount" integer DEFAULT 1 NOT NULL,
	"certificateId" text NOT NULL,
	"plantingLocation" text DEFAULT 'Hong Kong Reforestation Initiative' NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "treePlantings_certificateId_unique" UNIQUE("certificateId")
);
--> statement-breakpoint
ALTER TABLE "treePlantings" ADD CONSTRAINT "treePlantings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;