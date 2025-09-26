import { coupons } from "../db/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

const couponData = [
    // Food & Dining
    {
        id: "coupon_001",
        title: "20% Off Dim Sum",
        description: "Enjoy 20% off on all dim sum items during lunch hours (11 AM - 3 PM)",
        businessName: "Golden Dragon Restaurant",
        businessAddress: "Shop 3-4, G/F, 123 Nathan Road, Tsim Sha Tsui",
        discountType: "percentage" as const,
        discountValue: 20,
        originalPrice: null,
        finalPrice: null,
        tokenCost: 15,
        category: "food" as const,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400",
        terms: "Valid for lunch hours only. Cannot be combined with other offers. Maximum 4 people per table.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        maxRedemptions: 100,
        currentRedemptions: 0,
    },
    {
        id: "coupon_002",
        title: "HK$50 Off Hong Kong Style Tea",
        description: "Get HK$50 off when you spend HK$200 or more on authentic Hong Kong milk tea and snacks",
        businessName: "Cha Chaan Teng Central",
        businessAddress: "Shop 15, 2/F, Central Market, 93 Queen's Road Central",
        discountType: "fixed_amount" as const,
        discountValue: 5000, // HK$50 in cents
        originalPrice: null,
        finalPrice: null,
        tokenCost: 12,
        category: "food" as const,
        imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400",
        terms: "Minimum spend HK$200. Valid for dine-in only. One coupon per table per visit.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isActive: true,
        maxRedemptions: 200,
        currentRedemptions: 0,
    },
    {
        id: "coupon_003",
        title: "Buy 1 Get 1 Free Egg Waffles",
        description: "Buy one traditional Hong Kong egg waffle and get another one free",
        businessName: "Street Food Paradise",
        businessAddress: "Stall 12, Temple Street Night Market, Yau Ma Tei",
        discountType: "bogo" as const,
        discountValue: 1,
        originalPrice: 2500, // HK$25 for 2 waffles
        finalPrice: 2500, // Pay for 1, get 2
        tokenCost: 9,
        category: "food" as const,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        terms: "Valid after 6 PM only. Both waffles must be of the same flavor. Cash payment only.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        isActive: true,
        maxRedemptions: 150,
        currentRedemptions: 0,
    },

    // Shopping
    {
        id: "coupon_004",
        title: "15% Off Traditional Chinese Medicine",
        description: "Save 15% on all traditional Chinese medicine and herbal products",
        businessName: "Wing Lok Herbal Medicine",
        businessAddress: "45 Wing Lok Street, Sheung Wan",
        discountType: "percentage" as const,
        discountValue: 15,
        originalPrice: null,
        finalPrice: null,
        tokenCost: 18,
        category: "shopping" as const,
        imageUrl: "https://images.unsplash.com/photo-1609078593732-f8b5c4b7e3c5?w=400",
        terms: "Excludes consultation fees. Valid for in-store purchases only. Cannot be combined with membership discounts.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true,
        maxRedemptions: 80,
        currentRedemptions: 0,
    },
    {
        id: "coupon_005",
        title: "HK$100 Off Fashion Items",
        description: "Get HK$100 off when you spend HK$500 or more on local designer fashion",
        businessName: "Hong Kong Fashion Boutique",
        businessAddress: "Shop 25, 1/F, Causeway Bay Plaza 1, 489 Hennessy Road",
        discountType: "fixed_amount" as const,
        discountValue: 10000, // HK$100 in cents
        originalPrice: null,
        finalPrice: null,
        tokenCost: 24,
        category: "shopping" as const,
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        terms: "Minimum spend HK$500. Valid on regular-priced items only. Excludes sale items and accessories.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        maxRedemptions: 50,
        currentRedemptions: 0,
    },

    // Entertainment
    {
        id: "coupon_006",
        title: "25% Off Karaoke Room",
        description: "Enjoy 25% off 2-hour karaoke room rental during weekday afternoons",
        businessName: "Sing Along KTV",
        businessAddress: "3/F, 88 Canton Road, Tsim Sha Tsui",
        discountType: "percentage" as const,
        discountValue: 25,
        originalPrice: 20000, // HK$200 for 2 hours
        finalPrice: 15000, // HK$150 after discount
        tokenCost: 13,
        category: "entertainment" as const,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        terms: "Valid Monday to Friday, 2 PM - 6 PM only. Advance booking required. Food and drinks not included.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        maxRedemptions: 120,
        currentRedemptions: 0,
    },
    {
        id: "coupon_007",
        title: "Free Game of Mahjong",
        description: "Play one free game of traditional Cantonese mahjong with purchase of tea set",
        businessName: "Traditional Games Parlor",
        businessAddress: "2/F, 156 Des Voeux Road Central, Sheung Wan",
        discountType: "bogo" as const,
        discountValue: 1,
        originalPrice: 8000, // HK$80 (tea set + game)
        finalPrice: 5000, // HK$50 (tea set only)
        tokenCost: 7,
        category: "entertainment" as const,
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400",
        terms: "Valid for groups of 4 players. Tea set purchase mandatory. Game time limited to 2 hours.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isActive: true,
        maxRedemptions: 60,
        currentRedemptions: 0,
    },

    // Services
    {
        id: "coupon_008",
        title: "30% Off Traditional Massage",
        description: "Relax with 30% off 60-minute traditional Chinese therapeutic massage",
        businessName: "Healing Hands Wellness",
        businessAddress: "4/F, 200 Nathan Road, Jordan",
        discountType: "percentage" as const,
        discountValue: 30,
        originalPrice: 50000, // HK$500 for 60 minutes
        finalPrice: 35000, // HK$350 after discount
        tokenCost: 21,
        category: "services" as const,
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
        terms: "Appointment required. Valid for first-time customers only. Cannot be combined with package deals.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        maxRedemptions: 40,
        currentRedemptions: 0,
    },
    {
        id: "coupon_009",
        title: "HK$200 Off Tailoring Service",
        description: "Get HK$200 off custom tailoring for traditional Chinese qipao or suit",
        businessName: "Master Tailor Wong",
        businessAddress: "Shop 8, G/F, 75 Wellington Street, Central",
        discountType: "fixed_amount" as const,
        discountValue: 20000, // HK$200 in cents
        originalPrice: null,
        finalPrice: null,
        tokenCost: 30,
        category: "services" as const,
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400",
        terms: "Minimum order HK$1000. Excludes fabric cost. 2-week delivery time. Fitting appointments required.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        isActive: true,
        maxRedemptions: 25,
        currentRedemptions: 0,
    },
    {
        id: "coupon_010",
        title: "Free Feng Shui Consultation",
        description: "Receive a complimentary 30-minute feng shui consultation for your home or office",
        businessName: "Master Li Feng Shui Services",
        businessAddress: "Suite 1205, 12/F, 118 Connaught Road Central",
        discountType: "fixed_amount" as const,
        discountValue: 80000, // HK$800 value
        originalPrice: 80000,
        finalPrice: 0,
        tokenCost: 36,
        category: "services" as const,
        imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
        terms: "Appointment only. One consultation per customer. Additional services charged separately. Valid weekdays only.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true,
        maxRedemptions: 20,
        currentRedemptions: 0,
    },

    // Additional Food Options
    {
        id: "coupon_011",
        title: "10% Off Roast Duck",
        description: "Enjoy 10% off our famous Hong Kong-style roast duck and rice combo",
        businessName: "Kam's Roast Goose",
        businessAddress: "226 Hennessy Road, Wan Chai",
        discountType: "percentage" as const,
        discountValue: 10,
        originalPrice: null,
        finalPrice: null,
        tokenCost: 10,
        category: "food" as const,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        terms: "Valid for dine-in and takeaway. Cannot be combined with set meal discounts. Limited to 2 orders per coupon.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        isActive: true,
        maxRedemptions: 300,
        currentRedemptions: 0,
    },
    {
        id: "coupon_012",
        title: "Free Pineapple Bun with Coffee",
        description: "Get a free traditional pineapple bun with any coffee purchase",
        businessName: "Old School Cafe",
        businessAddress: "Shop 7, G/F, 45 Hollywood Road, Central",
        discountType: "bogo" as const,
        discountValue: 1,
        originalPrice: 4500, // HK$45 (coffee + bun)
        finalPrice: 2800, // HK$28 (coffee only)
        tokenCost: 6,
        category: "food" as const,
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
        terms: "Valid all day. Dine-in only. One free bun per coffee purchased. Cannot be combined with other promotions.",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isActive: true,
        maxRedemptions: 250,
        currentRedemptions: 0,
    },
];

async function seedCoupons() {
    console.log("🎫 Starting to seed coupons...");

    try {
        // Insert all coupons
        for (const coupon of couponData) {
            await db.insert(coupons).values(coupon).onConflictDoNothing();
            console.log(`✅ Inserted coupon: ${coupon.title} - ${coupon.businessName}`);
        }

        console.log(`🎉 Successfully seeded ${couponData.length} coupons!`);
        console.log("\nCoupons by category:");

        const categoryCount = couponData.reduce((acc, coupon) => {
            acc[coupon.category] = (acc[coupon.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} coupons`);
        });

    } catch (error) {
        console.error("❌ Error seeding coupons:", error);
        process.exit(1);
    }
}

// Run the seed function
seedCoupons()
    .then(() => {
        console.log("🏁 Coupon seeding completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Fatal error during seeding:", error);
        process.exit(1);
    });
