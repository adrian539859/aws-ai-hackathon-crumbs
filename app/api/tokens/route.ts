import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokenHistory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, sum } from "drizzle-orm";

// GET /api/tokens - Get user's token history and balance
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
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Get token history for the user
        const history = await db
            .select()
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id))
            .orderBy(desc(tokenHistory.createdAt))
            .limit(limit)
            .offset(offset);

        // Calculate total balance by summing all transactions
        const balanceResult = await db
            .select({ total: sum(tokenHistory.amount) })
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id));

        const balance = balanceResult[0]?.total || 0;

        return NextResponse.json({
            success: true,
            balance: Number(balance),
            history,
            pagination: {
                limit,
                offset,
                hasMore: history.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching token history:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/tokens - Create a new token transaction (admin/system use)
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
        const { amount, type, source, sourceId, description, metadata } = body;

        // Validate input
        if (!amount || !type || !source || !description) {
            return NextResponse.json(
                { error: "Missing required fields: amount, type, source, description" },
                { status: 400 }
            );
        }

        if (!['earned', 'spent', 'bonus', 'refund'].includes(type)) {
            return NextResponse.json(
                { error: "Invalid type. Must be one of: earned, spent, bonus, refund" },
                { status: 400 }
            );
        }

        // Generate token history ID
        const tokenHistoryId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create token history entry
        const newTokenHistory = await db.insert(tokenHistory).values({
            id: tokenHistoryId,
            userId: session.user.id,
            amount: Number(amount),
            type,
            source,
            sourceId,
            description,
            metadata: metadata ? JSON.stringify(metadata) : null,
        }).returning();

        return NextResponse.json({
            success: true,
            tokenHistory: newTokenHistory[0],
            message: "Token transaction created successfully.",
        });

    } catch (error) {
        console.error("Error creating token transaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
