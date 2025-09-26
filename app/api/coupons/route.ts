import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, userCoupons, tokenHistory } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, gte, desc, sum } from "drizzle-orm";

// GET /api/coupons - Get available coupons
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build query conditions
        let whereConditions = and(
            eq(coupons.isActive, true),
            gte(coupons.validUntil, new Date())
        );

        // Add category filter if provided
        if (category) {
            whereConditions = and(whereConditions, eq(coupons.category, category));
        }

        // Get available coupons
        const availableCoupons = await db
            .select()
            .from(coupons)
            .where(whereConditions)
            .orderBy(desc(coupons.createdAt))
            .limit(limit)
            .offset(offset);

        return NextResponse.json({
            success: true,
            coupons: availableCoupons,
            pagination: {
                limit,
                offset,
                hasMore: availableCoupons.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/coupons - Redeem a coupon with tokens
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
        const { couponId } = body;

        if (!couponId) {
            return NextResponse.json(
                { error: "couponId is required" },
                { status: 400 }
            );
        }

        // Get the coupon
        const coupon = await db
            .select()
            .from(coupons)
            .where(eq(coupons.id, couponId))
            .limit(1);

        if (!coupon[0]) {
            return NextResponse.json(
                { error: "Coupon not found" },
                { status: 404 }
            );
        }

        const couponData = coupon[0];

        // Check if coupon is still valid
        if (!couponData.isActive || new Date() > couponData.validUntil) {
            return NextResponse.json(
                { error: "Coupon is no longer valid" },
                { status: 400 }
            );
        }

        // Check if coupon has reached max redemptions
        if (couponData.maxRedemptions && couponData.currentRedemptions >= couponData.maxRedemptions) {
            return NextResponse.json(
                { error: "Coupon has reached maximum redemptions" },
                { status: 400 }
            );
        }

        // Check user's token balance
        const balanceResult = await db
            .select({ total: sum(tokenHistory.amount) })
            .from(tokenHistory)
            .where(eq(tokenHistory.userId, session.user.id));

        const userBalance = Number(balanceResult[0]?.total || 0);

        if (userBalance < couponData.tokenCost) {
            return NextResponse.json(
                { error: "Insufficient tokens" },
                { status: 400 }
            );
        }

        // Generate unique redemption code
        const redemptionCode = `HK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Start transaction
        const userCouponId = `user_coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tokenHistoryId = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create user coupon redemption
        const newUserCoupon = await db.insert(userCoupons).values({
            id: userCouponId,
            userId: session.user.id,
            couponId: couponData.id,
            redemptionCode,
            expiresAt: couponData.validUntil,
        }).returning();

        // Deduct tokens from user
        await db.insert(tokenHistory).values({
            id: tokenHistoryId,
            userId: session.user.id,
            amount: -couponData.tokenCost,
            type: 'spent',
            source: 'coupon_redemption',
            sourceId: couponData.id,
            description: `Redeemed coupon: ${couponData.title}`,
            metadata: JSON.stringify({
                couponId: couponData.id,
                redemptionCode,
                businessName: couponData.businessName
            }),
        });

        // Update coupon redemption count
        await db
            .update(coupons)
            .set({
                currentRedemptions: couponData.currentRedemptions + 1,
                updatedAt: new Date()
            })
            .where(eq(coupons.id, couponData.id));

        return NextResponse.json({
            success: true,
            userCoupon: newUserCoupon[0],
            coupon: couponData,
            message: "Coupon redeemed successfully!",
        });

    } catch (error) {
        console.error("Error redeeming coupon:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
