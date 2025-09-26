import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, attractions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

// GET /api/user/reviews - Get user's reviews with attraction details
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

        // Get user's reviews with attraction details
        const userReviews = await db
            .select({
                id: reviews.id,
                attractionId: reviews.attractionId,
                attractionName: attractions.name,
                attractionImageUrl: attractions.imageUrl,
                rating: reviews.rating,
                title: reviews.title,
                content: reviews.content,
                isVerified: reviews.isVerified,
                tokensEarned: reviews.tokensEarned,
                createdAt: reviews.createdAt,
                updatedAt: reviews.updatedAt,
            })
            .from(reviews)
            .innerJoin(attractions, eq(reviews.attractionId, attractions.id))
            .where(eq(reviews.userId, session.user.id))
            .orderBy(desc(reviews.createdAt))
            .limit(limit)
            .offset(offset);

        return NextResponse.json({
            success: true,
            reviews: userReviews,
            pagination: {
                limit,
                offset,
                hasMore: userReviews.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
