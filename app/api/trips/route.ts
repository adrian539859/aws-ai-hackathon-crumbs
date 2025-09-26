import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips } from "@/db/schema";
import { eq, and, like, sql } from "drizzle-orm";
import type { Trip } from "@/lib/types";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Get query parameters
        const category = searchParams.get("category");
        const transportMode = searchParams.get("transport");
        const visuallyImpaired = searchParams.get("visuallyImpaired") === "true";
        const wheelchairAccess = searchParams.get("wheelchairAccess") === "true";
        const destination = searchParams.get("destination");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build the query conditions
        const conditions = [];

        if (category && category !== "") {
            conditions.push(eq(trips.category, category));
        }

        if (transportMode) {
            conditions.push(like(trips.transportMode, `%"${transportMode}"%`));
        }

        // For accessibility, we need to check the JSON field
        if (visuallyImpaired) {
            conditions.push(sql`JSON_EXTRACT(${trips.accessibility}, '$.visuallyImpaired') = true`);
        }

        if (wheelchairAccess) {
            conditions.push(sql`JSON_EXTRACT(${trips.accessibility}, '$.wheelchairAccessible') = true`);
        }

        // Execute query
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const result = await db
            .select()
            .from(trips)
            .where(whereClause)
            .orderBy(sql`${trips.rating} DESC`)
            .limit(limit)
            .offset(offset);

        // Transform the data to match the frontend interface
        const transformedTrips: Trip[] = result.map((trip) => ({
            id: trip.id,
            name: trip.name,
            description: trip.description,
            duration: trip.duration,
            rating: trip.rating,
            reviewCount: trip.reviewCount,
            isPremium: trip.isPremium,
            isLocked: trip.isLocked,
            tokenCost: trip.tokenCost,
            category: trip.category as Trip['category'],
            transportMode: JSON.parse(trip.transportMode),
            accessibility: JSON.parse(trip.accessibility),
            imageUrl: trip.imageUrl || undefined,
            itinerary: JSON.parse(trip.itinerary),
            metadata: trip.metadata ? JSON.parse(trip.metadata) : undefined,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        }));

        return NextResponse.json({
            trips: transformedTrips,
            total: transformedTrips.length,
            hasMore: transformedTrips.length === limit
        });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json(
            { error: "Failed to fetch trips" },
            { status: 500 }
        );
    }
}
