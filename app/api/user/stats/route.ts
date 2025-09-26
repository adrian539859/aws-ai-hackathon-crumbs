import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokenHistory, reviews } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sum, count } from "drizzle-orm";

// GET /api/user/stats - Get user's token balance and reviews count
export async function GET(request: NextRequest) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get token balance by summing all transactions
        const balanceResult = await db
            .select({ total: sum(tokenHistory.amount) })
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id));

        const tokenBalance = Number(balanceResult[0]?.total || 0);

        // Get reviews count
        const reviewsResult = await db
            .select({ count: count() })
            .from(reviews)
            .where(eq(reviews.userId, session.user.id));

        const reviewsCount = reviewsResult[0]?.count || 0;

        return NextResponse.json({
            success: true,
            stats: {
                tokenBalance,
                reviewsCount,
            }
        });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
