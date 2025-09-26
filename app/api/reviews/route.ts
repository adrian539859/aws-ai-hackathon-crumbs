import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, attractions, tokenHistory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { CreateReviewRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: CreateReviewRequest = await request.json();
        const { attractionId, rating, title, content } = body;

        // Validate input
        if (!attractionId || !rating || !content) {
            return NextResponse.json(
                { error: "Missing required fields: attractionId, rating, content" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Check if attraction exists
        const attraction = await db.select().from(attractions).where(eq(attractions.id, attractionId)).limit(1);

        if (attraction.length === 0) {
            return NextResponse.json(
                { error: "Attraction not found" },
                { status: 404 }
            );
        }

        // Check if user already reviewed this attraction
        const existingReview = await db.select().from(reviews)
            .where(and(eq(reviews.attractionId, attractionId), eq(reviews.userId, session.user.id)))
            .limit(1);

        if (existingReview.length > 0) {
            return NextResponse.json(
                { error: "You have already reviewed this attraction" },
                { status: 400 }
            );
        }

        // Generate review ID
        const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Calculate tokens earned (base 10 tokens, bonus for longer reviews)
        const tokensEarned = content.length > 100 ? 15 : 10;

        // Create the review
        const newReview = await db.insert(reviews).values({
            id: reviewId,
            attractionId,
            userId: session.user.id,
            rating,
            title,
            content,
            isVerified: false, // Reviews need to be verified to earn full tokens
            tokensEarned,
        }).returning();

        // Update attraction rating and review count, and create token history entry
        await db.transaction(async (tx) => {
            // Get current attraction stats
            const currentAttraction = await tx.select().from(attractions).where(eq(attractions.id, attractionId)).limit(1);

            if (currentAttraction.length > 0) {
                const current = currentAttraction[0];
                const newReviewCount = current.reviewCount + 1;
                const newRating =
                    (current.rating * current.reviewCount + rating) / newReviewCount;

                await tx.update(attractions)
                    .set({
                        rating: Number(newRating.toFixed(1)),
                        reviewCount: newReviewCount,
                        updatedAt: new Date(),
                    })
                    .where(eq(attractions.id, attractionId));
            }

            // Create token history entry (append-only design)
            const tokenHistoryId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await tx.insert(tokenHistory).values({
                id: tokenHistoryId,
                userId: session.user.id,
                amount: tokensEarned,
                type: 'earned',
                source: 'review',
                sourceId: reviewId,
                description: `Earned ${tokensEarned} tokens for reviewing ${currentAttraction[0]?.name || 'attraction'}`,
                metadata: JSON.stringify({
                    attractionId,
                    reviewLength: content.length,
                    bonusApplied: content.length > 100
                })
            });
        });

        return NextResponse.json({
            success: true,
            review: newReview[0],
            tokensEarned,
            message: "Review created successfully! Tokens will be awarded after verification.",
        });

    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const attractionId = searchParams.get("attractionId");

        if (!attractionId) {
            return NextResponse.json(
                { error: "attractionId parameter is required" },
                { status: 400 }
            );
        }

        // Get reviews for the attraction
        const attractionReviews = await db.select({
            id: reviews.id,
            attractionId: reviews.attractionId,
            userId: reviews.userId,
            rating: reviews.rating,
            title: reviews.title,
            content: reviews.content,
            isVerified: reviews.isVerified,
            tokensEarned: reviews.tokensEarned,
            createdAt: reviews.createdAt,
            updatedAt: reviews.updatedAt,
        }).from(reviews).where(eq(reviews.attractionId, attractionId));

        return NextResponse.json({
            success: true,
            reviews: attractionReviews,
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
