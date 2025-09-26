import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userCoupons, coupons } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

// GET /api/user/coupons - Get user's redeemed coupons
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
        const status = searchParams.get("status"); // 'active', 'used', 'expired'
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Get user's coupons with coupon details
        let query = db
            .select({
                id: userCoupons.id,
                userId: userCoupons.userId,
                couponId: userCoupons.couponId,
                redemptionCode: userCoupons.redemptionCode,
                isUsed: userCoupons.isUsed,
                usedAt: userCoupons.usedAt,
                redeemedAt: userCoupons.redeemedAt,
                expiresAt: userCoupons.expiresAt,
                // Coupon details
                coupon: {
                    id: coupons.id,
                    title: coupons.title,
                    description: coupons.description,
                    businessName: coupons.businessName,
                    businessAddress: coupons.businessAddress,
                    discountType: coupons.discountType,
                    discountValue: coupons.discountValue,
                    originalPrice: coupons.originalPrice,
                    finalPrice: coupons.finalPrice,
                    tokenCost: coupons.tokenCost,
                    category: coupons.category,
                    imageUrl: coupons.imageUrl,
                    terms: coupons.terms,
                    validFrom: coupons.validFrom,
                    validUntil: coupons.validUntil,
                }
            })
            .from(userCoupons)
            .innerJoin(coupons, eq(userCoupons.couponId, coupons.id))
            .where(eq(userCoupons.userId, session.user.id))
            .orderBy(desc(userCoupons.redeemedAt))
            .limit(limit)
            .offset(offset);

        const userCouponsList = await query;

        // Filter by status if provided
        let filteredCoupons = userCouponsList;
        if (status) {
            const now = new Date();
            filteredCoupons = userCouponsList.filter(uc => {
                switch (status) {
                    case 'used':
                        return uc.isUsed;
                    case 'expired':
                        return !uc.isUsed && uc.expiresAt < now;
                    case 'active':
                        return !uc.isUsed && uc.expiresAt >= now;
                    default:
                        return true;
                }
            });
        }

        return NextResponse.json({
            success: true,
            coupons: filteredCoupons,
            pagination: {
                limit,
                offset,
                hasMore: userCouponsList.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching user coupons:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/user/coupons - Mark a coupon as used
export async function PUT(request: NextRequest) {
    try {
        // Get session from auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { userCouponId } = body;

        if (!userCouponId) {
            return NextResponse.json(
                { error: "userCouponId is required" },
                { status: 400 }
            );
        }

        // Check if the coupon belongs to the user
        const userCoupon = await db
            .select()
            .from(userCoupons)
            .where(eq(userCoupons.id, userCouponId))
            .limit(1);

        if (!userCoupon[0]) {
            return NextResponse.json(
                { error: "Coupon not found" },
                { status: 404 }
            );
        }

        if (userCoupon[0].userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        if (userCoupon[0].isUsed) {
            return NextResponse.json(
                { error: "Coupon already used" },
                { status: 400 }
            );
        }

        // Check if coupon is expired
        if (new Date() > userCoupon[0].expiresAt) {
            return NextResponse.json(
                { error: "Coupon has expired" },
                { status: 400 }
            );
        }

        // Mark coupon as used
        const updatedCoupon = await db
            .update(userCoupons)
            .set({
                isUsed: true,
                usedAt: new Date(),
            })
            .where(eq(userCoupons.id, userCouponId))
            .returning();

        return NextResponse.json({
            success: true,
            userCoupon: updatedCoupon[0],
            message: "Coupon marked as used successfully!",
        });

    } catch (error) {
        console.error("Error updating user coupon:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
