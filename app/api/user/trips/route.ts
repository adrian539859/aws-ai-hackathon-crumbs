import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userTrips, trips } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { UserTrip } from "@/lib/types";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // 'unlocked', 'started', 'completed'
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build query conditions
        const conditions = [eq(userTrips.userId, session.user.id)];

        // Add status filter if provided
        if (status) {
            conditions.push(eq(userTrips.status, status));
        }

        // Build query with join to get trip details
        const query = db
            .select({
                id: userTrips.id,
                userId: userTrips.userId,
                tripId: userTrips.tripId,
                unlockedAt: userTrips.unlockedAt,
                tokensSpent: userTrips.tokensSpent,
                status: userTrips.status,
                startedAt: userTrips.startedAt,
                completedAt: userTrips.completedAt,
                progress: userTrips.progress,
                createdAt: userTrips.createdAt,
                updatedAt: userTrips.updatedAt,
                // Trip details
                tripName: trips.name,
                tripDescription: trips.description,
                tripDuration: trips.duration,
                tripRating: trips.rating,
                tripReviewCount: trips.reviewCount,
                tripCategory: trips.category,
                tripImageUrl: trips.imageUrl,
                tripItinerary: trips.itinerary,
                tripTransportMode: trips.transportMode,
                tripAccessibility: trips.accessibility,
            })
            .from(userTrips)
            .innerJoin(trips, eq(userTrips.tripId, trips.id))
            .where(and(...conditions))
            .orderBy(userTrips.unlockedAt)
            .limit(limit)
            .offset(offset);

        const result = await query;

        // Transform the data to match the frontend interface
        const transformedUserTrips: UserTrip[] = result.map((row) => ({
            id: row.id,
            userId: row.userId,
            tripId: row.tripId,
            unlockedAt: row.unlockedAt,
            tokensSpent: row.tokensSpent,
            status: row.status as UserTrip['status'],
            startedAt: row.startedAt || undefined,
            completedAt: row.completedAt || undefined,
            progress: row.progress ? JSON.parse(row.progress) : undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            trip: {
                id: row.tripId,
                name: row.tripName,
                description: row.tripDescription,
                duration: row.tripDuration,
                rating: row.tripRating,
                reviewCount: row.tripReviewCount,
                isPremium: true, // All unlocked trips were premium
                isLocked: false, // All user trips are unlocked
                tokenCost: row.tokensSpent,
                category: row.tripCategory as any,
                transportMode: JSON.parse(row.tripTransportMode),
                accessibility: JSON.parse(row.tripAccessibility),
                imageUrl: row.tripImageUrl || undefined,
                itinerary: JSON.parse(row.tripItinerary),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }));

        return NextResponse.json({
            userTrips: transformedUserTrips,
            total: transformedUserTrips.length,
            hasMore: transformedUserTrips.length === limit
        });
    } catch (error) {
        console.error("Error fetching user trips:", error);
        return NextResponse.json(
            { error: "Failed to fetch user trips" },
            { status: 500 }
        );
    }
}

// Update trip status (start, complete)
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { tripId, status, progress } = await request.json();

        if (!tripId || !status) {
            return NextResponse.json(
                { error: "Trip ID and status are required" },
                { status: 400 }
            );
        }

        // Validate status
        if (!['unlocked', 'started', 'completed'].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Check if user has this trip
        const existingUserTrip = await db
            .select()
            .from(userTrips)
            .where(and(
                eq(userTrips.userId, session.user.id),
                eq(userTrips.tripId, tripId)
            ))
            .limit(1);

        if (existingUserTrip.length === 0) {
            return NextResponse.json(
                { error: "Trip not found in user's collection" },
                { status: 404 }
            );
        }

        // Update the trip status
        const updateData: any = {
            status,
            updatedAt: new Date(),
        };

        if (status === 'started' && existingUserTrip[0].status !== 'started') {
            updateData.startedAt = new Date();
        }

        if (status === 'completed' && existingUserTrip[0].status !== 'completed') {
            updateData.completedAt = new Date();
        }

        if (progress) {
            updateData.progress = JSON.stringify(progress);
        }

        await db
            .update(userTrips)
            .set(updateData)
            .where(and(
                eq(userTrips.userId, session.user.id),
                eq(userTrips.tripId, tripId)
            ));

        return NextResponse.json({
            success: true,
            message: "Trip status updated successfully"
        });

    } catch (error) {
        console.error("Error updating trip status:", error);
        return NextResponse.json(
            { error: "Failed to update trip status" },
            { status: 500 }
        );
    }
}
