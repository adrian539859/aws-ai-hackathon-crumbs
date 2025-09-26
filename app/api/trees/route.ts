import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { treePlantings, tokenHistory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sum } from "drizzle-orm";

// GET /api/trees - Get user's tree planting history
export async function GET(request: NextRequest) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Get user's tree plantings
        const userTrees = await db
            .select()
            .from(treePlantings)
            .where(eq(treePlantings.userId, session.user.id))
            .orderBy(treePlantings.createdAt)
            .limit(limit)
            .offset(offset);

        // Get total trees planted by user
        const totalTreesResult = await db
            .select({ total: sum(treePlantings.treeCount) })
            .from(treePlantings)
            .where(eq(treePlantings.userId, session.user.id));

        const totalTrees = Number(totalTreesResult[0]?.total || 0);

        return NextResponse.json({
            success: true,
            trees: userTrees,
            totalTrees,
            pagination: {
                limit,
                offset,
                hasMore: userTrees.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching tree plantings:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/trees - Plant a tree with tokens
export async function POST(request: NextRequest) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { treeCount = 1, plantingLocation = "Hong Kong Reforestation Initiative" } = body;

        if (!Number.isInteger(treeCount) || treeCount < 1 || treeCount > 10) {
            return NextResponse.json(
                { error: "Tree count must be between 1 and 10" },
                { status: 400 }
            );
        }

        const tokensCost = treeCount * 10; // 10 tokens per tree

        // Check user's token balance
        const balanceResult = await db
            .select({ total: sum(tokenHistory.amount) })
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id));

        const userBalance = Number(balanceResult[0]?.total || 0);

        if (userBalance < tokensCost) {
            return NextResponse.json(
                {
                    error: "Insufficient tokens",
                    required: tokensCost,
                    current: userBalance
                },
                { status: 400 }
            );
        }

        // Generate unique IDs
        const treePlantingId = `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const certificateId = `CERT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const tokenHistoryId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Start transaction
        await db.transaction(async (tx) => {
            // Create tree planting record
            await tx.insert(treePlantings).values({
                id: treePlantingId,
                userId: session.user.id,
                tokensCost,
                treeCount,
                certificateId,
                plantingLocation,
                status: 'confirmed',
                metadata: JSON.stringify({
                    donationDate: new Date().toISOString(),
                    estimatedPlantingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
                    treeSpecies: "Native Hong Kong species (mix)",
                    carbonOffset: `~${treeCount * 22}kg CO2/year` // Rough estimate
                })
            });

            // Deduct tokens from user
            await tx.insert(tokenHistory).values({
                id: tokenHistoryId,
                userId: session.user.id,
                amount: -tokensCost,
                type: 'spent',
                source: 'tree_donation',
                sourceId: treePlantingId,
                description: `Planted ${treeCount} tree${treeCount > 1 ? 's' : ''} for ESG initiative`,
                metadata: JSON.stringify({
                    treePlantingId,
                    certificateId,
                    treeCount,
                    plantingLocation,
                    carbonImpact: `~${treeCount * 22}kg CO2/year`
                })
            });
        });

        return NextResponse.json({
            success: true,
            message: `Successfully planted ${treeCount} tree${treeCount > 1 ? 's' : ''}!`,
            treePlanting: {
                id: treePlantingId,
                certificateId,
                treeCount,
                tokensCost,
                plantingLocation,
                estimatedCarbonOffset: `~${treeCount * 22}kg CO2/year`
            }
        });

    } catch (error) {
        console.error("Error planting trees:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
