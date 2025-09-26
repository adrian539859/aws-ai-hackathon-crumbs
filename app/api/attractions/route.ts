import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attractions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        // Get all attractions, optionally filtered by category
        let attractionsList;

        if (category) {
            // Filter by category only
            attractionsList = await db
                .select()
                .from(attractions)
                .where(eq(attractions.category, category))
                .orderBy(desc(attractions.rating), desc(attractions.reviewCount));
        } else {
            // Get all attractions
            attractionsList = await db
                .select()
                .from(attractions)
                .orderBy(desc(attractions.rating), desc(attractions.reviewCount));
        }

        return NextResponse.json({
            success: true,
            attractions: attractionsList,
            total: attractionsList.length,
        });

    } catch (error) {
        console.error("Error fetching attractions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
