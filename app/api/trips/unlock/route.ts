import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips, userTrips, tokenHistory } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
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

        const { tripId } = await request.json();

        if (!tripId) {
            return NextResponse.json(
                { error: "Trip ID is required" },
                { status: 400 }
            );
        }

        // Get the trip details
        const trip = await db
            .select()
            .from(trips)
            .where(eq(trips.id, tripId))
            .limit(1);

        if (trip.length === 0) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        const tripData = trip[0];

        // Check if trip is locked and requires tokens
        if (!tripData.isLocked || tripData.tokenCost === 0) {
            return NextResponse.json(
                { error: "Trip does not require unlocking" },
                { status: 400 }
            );
        }

        // Check if user already has this trip unlocked
        const existingUserTrip = await db
            .select()
            .from(userTrips)
            .where(and(
                eq(userTrips.userId, session.user.id),
                eq(userTrips.tripId, tripId)
            ))
            .limit(1);

        if (existingUserTrip.length > 0) {
            return NextResponse.json(
                { error: "Trip already unlocked" },
                { status: 400 }
            );
        }

        // Calculate user's current token balance
        const tokenBalanceResult = await db
            .select({
                balance: sql<number>`COALESCE(SUM(${tokenHistory.amount}), 0)`
            })
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id));

        const currentBalance = tokenBalanceResult[0]?.balance || 0;

        // Check if user has enough tokens
        if (currentBalance < tripData.tokenCost) {
            return NextResponse.json(
                {
                    error: "Insufficient tokens",
                    required: tripData.tokenCost,
                    current: currentBalance
                },
                { status: 400 }
            );
        }

        // Start transaction
        await db.transaction(async (tx) => {
            // Create token spending record
            await tx.insert(tokenHistory).values({
                id: nanoid(),
                userId: session.user.id,
                amount: -tripData.tokenCost,
                type: 'spent',
                source: 'trip_unlock',
                sourceId: tripId,
                description: `Unlocked trip: ${tripData.name}`,
                metadata: JSON.stringify({
                    tripId,
                    tripName: tripData.name,
                    tokenCost: tripData.tokenCost
                }),
                createdAt: new Date(),
            });

            // Create user trip record
            await tx.insert(userTrips).values({
                id: nanoid(),
                userId: session.user.id,
                tripId: tripId,
                unlockedAt: new Date(),
                tokensSpent: tripData.tokenCost,
                status: 'unlocked',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        // Calculate new balance
        const newBalance = currentBalance - tripData.tokenCost;

        return NextResponse.json({
            success: true,
            message: "Trip unlocked successfully",
            tokensSpent: tripData.tokenCost,
            newBalance: newBalance,
            trip: {
                id: tripData.id,
                name: tripData.name,
                description: tripData.description,
            }
        });

    } catch (error) {
        console.error("Error unlocking trip:", error);
        return NextResponse.json(
            { error: "Failed to unlock trip" },
            { status: 500 }
        );
    }
}
