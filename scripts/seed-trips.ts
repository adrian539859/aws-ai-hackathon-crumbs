import { drizzle } from "drizzle-orm/neon-serverless";
import { trips } from "../db/schema";
import { nanoid } from "nanoid";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const db = drizzle(process.env.DATABASE_URL);

const tripCategories = ['restaurant', 'shopping', 'entertainment', 'nature', 'culture'] as const;

const sampleTrips = [
    // Free trips
    {
        name: "Central Heritage Walk",
        description: "Explore historic Central district with guided audio tour through colonial architecture and modern landmarks",
        duration: "2h 30m",
        category: "culture",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Former Legislative Council Building", description: "Historic government building", duration: "20m", location: "Central", category: "culture", order: 1 },
            { id: "stop2", name: "Statue Square", description: "Historic public square", duration: "15m", location: "Central", category: "culture", order: 2 },
            { id: "stop3", name: "Hong Kong Club Building", description: "Colonial architecture", duration: "15m", location: "Central", category: "culture", order: 3 }
        ]
    },
    {
        name: "Tai Kwun Art Discovery",
        description: "Contemporary art galleries and historic police station with interactive exhibits",
        duration: "1h 45m",
        category: "entertainment",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Heritage Gallery", description: "Historical exhibits", duration: "30m", location: "Tai Kwun", category: "culture", order: 1 },
            { id: "stop2", name: "Contemporary Gallery", description: "Modern art displays", duration: "45m", location: "Tai Kwun", category: "entertainment", order: 2 }
        ]
    },
    {
        name: "Nature Photography Tour",
        description: "Capture stunning landscapes in Hong Kong's nature reserves with professional tips",
        duration: "4h 00m",
        category: "nature",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["car", "bike"],
        itinerary: [
            { id: "stop1", name: "Dragon's Back Trail", description: "Scenic hiking trail", duration: "2h", location: "Shek O", category: "nature", order: 1 },
            { id: "stop2", name: "Big Wave Bay", description: "Coastal photography spot", duration: "1h", location: "Big Wave Bay", category: "nature", order: 2 }
        ]
    },
    {
        name: "Shopping District Explorer",
        description: "Discover hidden gems in bustling shopping areas and local markets",
        duration: "2h 15m",
        category: "shopping",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Causeway Bay Shopping", description: "Major shopping district", duration: "1h", location: "Causeway Bay", category: "shopping", order: 1 },
            { id: "stop2", name: "Times Square", description: "Shopping mall", duration: "45m", location: "Causeway Bay", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Street Food Adventure",
        description: "Taste authentic local street food across traditional markets",
        duration: "3h 00m",
        category: "restaurant",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Temple Street Night Market", description: "Famous street food market", duration: "1h 30m", location: "Yau Ma Tei", category: "restaurant", order: 1 },
            { id: "stop2", name: "Ladies' Market", description: "Local street food stalls", duration: "1h 30m", location: "Mong Kok", category: "restaurant", order: 2 }
        ]
    },
    // Premium locked trips
    {
        name: "Premium Food Trail",
        description: "Exclusive dining experience with local chef guides at Michelin-starred restaurants",
        duration: "3h 15m",
        category: "restaurant",
        isPremium: true,
        isLocked: true,
        tokenCost: 50,
        transportMode: ["car", "walk"],
        itinerary: [
            { id: "stop1", name: "Michelin Star Restaurant", description: "Fine dining experience", duration: "2h", location: "Central", category: "restaurant", order: 1 },
            { id: "stop2", name: "Private Chef Demo", description: "Cooking demonstration", duration: "1h 15m", location: "Central", category: "restaurant", order: 2 }
        ]
    },
    {
        name: "Premium Cultural Experience",
        description: "VIP access to museums and cultural sites with private curator tours",
        duration: "5h 30m",
        category: "culture",
        isPremium: true,
        isLocked: true,
        tokenCost: 75,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Hong Kong Museum of Art", description: "VIP private tour", duration: "2h", location: "Tsim Sha Tsui", category: "culture", order: 1 },
            { id: "stop2", name: "Hong Kong Space Museum", description: "Exclusive planetarium show", duration: "1h 30m", location: "Tsim Sha Tsui", category: "culture", order: 2 },
            { id: "stop3", name: "Private Collection Viewing", description: "Rare artifacts viewing", duration: "2h", location: "Central", category: "culture", order: 3 }
        ]
    },
    {
        name: "Luxury Harbor Cruise",
        description: "Private yacht tour around Victoria Harbor with gourmet dining",
        duration: "4h 00m",
        category: "entertainment",
        isPremium: true,
        isLocked: true,
        tokenCost: 100,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Private Yacht Boarding", description: "Luxury yacht experience", duration: "4h", location: "Central Pier", category: "entertainment", order: 1 }
        ]
    },
    {
        name: "Exclusive Shopping Experience",
        description: "Personal shopping assistant at luxury boutiques with VIP access",
        duration: "3h 30m",
        category: "shopping",
        isPremium: true,
        isLocked: true,
        tokenCost: 60,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Luxury Boutiques", description: "Personal shopping service", duration: "2h", location: "Central", category: "shopping", order: 1 },
            { id: "stop2", name: "Private Fitting Room", description: "Exclusive styling session", duration: "1h 30m", location: "Central", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Premium Nature Retreat",
        description: "Private guided hike with luxury picnic and spa treatments",
        duration: "6h 00m",
        category: "nature",
        isPremium: true,
        isLocked: true,
        tokenCost: 80,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Private Hiking Trail", description: "Guided nature walk", duration: "3h", location: "Sai Kung", category: "nature", order: 1 },
            { id: "stop2", name: "Luxury Picnic", description: "Gourmet outdoor dining", duration: "1h 30m", location: "Sai Kung", category: "nature", order: 2 },
            { id: "stop3", name: "Spa Treatment", description: "Outdoor massage therapy", duration: "1h 30m", location: "Sai Kung", category: "nature", order: 3 }
        ]
    },
    // Additional free trips
    {
        name: "Temple Hopping Tour",
        description: "Visit ancient temples and learn about local spiritual practices",
        duration: "2h 45m",
        category: "culture",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Man Mo Temple", description: "Historic Taoist temple", duration: "45m", location: "Sheung Wan", category: "culture", order: 1 },
            { id: "stop2", name: "Wong Tai Sin Temple", description: "Famous fortune telling temple", duration: "1h", location: "Wong Tai Sin", category: "culture", order: 2 },
            { id: "stop3", name: "Chi Lin Nunnery", description: "Buddhist wooden temple", duration: "1h", location: "Diamond Hill", category: "culture", order: 3 }
        ]
    },
    {
        name: "Local Markets Adventure",
        description: "Explore traditional wet markets and learn about local ingredients",
        duration: "2h 00m",
        category: "shopping",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Graham Street Market", description: "Traditional wet market", duration: "1h", location: "Central", category: "shopping", order: 1 },
            { id: "stop2", name: "Tai Yuen Street Market", description: "Toy street market", duration: "1h", location: "Wan Chai", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Rooftop Bars Circuit",
        description: "Visit the best rooftop bars with stunning city views",
        duration: "3h 30m",
        category: "entertainment",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Sky Bar", description: "Panoramic city views", duration: "1h 30m", location: "Central", category: "entertainment", order: 1 },
            { id: "stop2", name: "Rooftop Lounge", description: "Harbor view cocktails", duration: "2h", location: "Tsim Sha Tsui", category: "entertainment", order: 2 }
        ]
    },
    {
        name: "Hiking Trail Explorer",
        description: "Discover scenic hiking trails suitable for all fitness levels",
        duration: "3h 15m",
        category: "nature",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["car", "walk"],
        itinerary: [
            { id: "stop1", name: "Lion Pavilion", description: "Easy hiking trail", duration: "1h 30m", location: "Tsim Sha Tsui", category: "nature", order: 1 },
            { id: "stop2", name: "Victoria Peak Garden", description: "Scenic viewpoint", duration: "1h 45m", location: "The Peak", category: "nature", order: 2 }
        ]
    },
    {
        name: "Dim Sum Crawl",
        description: "Traditional dim sum experience across famous tea houses",
        duration: "2h 30m",
        category: "restaurant",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Maxim's Palace", description: "Traditional dim sum", duration: "1h 15m", location: "Central", category: "restaurant", order: 1 },
            { id: "stop2", name: "Lin Heung Tea House", description: "Old-style tea house", duration: "1h 15m", location: "Central", category: "restaurant", order: 2 }
        ]
    },
    // More premium trips
    {
        name: "Private Art Collection Tour",
        description: "Exclusive access to private art collections with expert commentary",
        duration: "4h 30m",
        category: "culture",
        isPremium: true,
        isLocked: true,
        tokenCost: 90,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Private Gallery", description: "Exclusive art viewing", duration: "2h", location: "Central", category: "culture", order: 1 },
            { id: "stop2", name: "Artist Studio Visit", description: "Meet local artists", duration: "2h 30m", location: "Wong Chuk Hang", category: "culture", order: 2 }
        ]
    },
    {
        name: "Luxury Spa & Wellness",
        description: "Premium spa treatments with traditional Chinese medicine",
        duration: "5h 00m",
        category: "entertainment",
        isPremium: true,
        isLocked: true,
        tokenCost: 85,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Luxury Spa", description: "Full body treatment", duration: "3h", location: "Central", category: "entertainment", order: 1 },
            { id: "stop2", name: "Traditional Medicine Consultation", description: "TCM health assessment", duration: "2h", location: "Central", category: "entertainment", order: 2 }
        ]
    },
    {
        name: "Gourmet Market Tour",
        description: "Private chef-guided tour of premium food markets with tastings",
        duration: "3h 45m",
        category: "restaurant",
        isPremium: true,
        isLocked: true,
        tokenCost: 65,
        transportMode: ["car", "walk"],
        itinerary: [
            { id: "stop1", name: "Premium Food Market", description: "Chef-guided tasting", duration: "2h", location: "Central", category: "restaurant", order: 1 },
            { id: "stop2", name: "Cooking Class", description: "Private cooking lesson", duration: "1h 45m", location: "Central", category: "restaurant", order: 2 }
        ]
    },
    {
        name: "Designer Shopping Experience",
        description: "Access to designer showrooms with personal stylist service",
        duration: "4h 15m",
        category: "shopping",
        isPremium: true,
        isLocked: true,
        tokenCost: 70,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Designer Showroom", description: "Exclusive fashion viewing", duration: "2h", location: "Central", category: "shopping", order: 1 },
            { id: "stop2", name: "Personal Styling Session", description: "Professional styling", duration: "2h 15m", location: "Central", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Private Island Experience",
        description: "Exclusive access to private island with water sports and dining",
        duration: "7h 00m",
        category: "nature",
        isPremium: true,
        isLocked: true,
        tokenCost: 120,
        transportMode: ["car"],
        itinerary: [
            { id: "stop1", name: "Private Ferry", description: "Luxury boat transfer", duration: "1h", location: "Central Pier", category: "nature", order: 1 },
            { id: "stop2", name: "Private Beach", description: "Exclusive beach access", duration: "4h", location: "Private Island", category: "nature", order: 2 },
            { id: "stop3", name: "Gourmet Beach Dining", description: "Chef-prepared meal", duration: "2h", location: "Private Island", category: "nature", order: 3 }
        ]
    },
    // Additional free trips to reach 30 total
    {
        name: "Street Art Discovery",
        description: "Find hidden street art and murals across different neighborhoods",
        duration: "2h 20m",
        category: "culture",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "PMQ Street Art", description: "Creative hub murals", duration: "1h", location: "Central", category: "culture", order: 1 },
            { id: "stop2", name: "Sheung Wan Graffiti", description: "Local street art", duration: "1h 20m", location: "Sheung Wan", category: "culture", order: 2 }
        ]
    },
    {
        name: "Night Market Food Tour",
        description: "Experience the vibrant night market culture and street food",
        duration: "3h 00m",
        category: "restaurant",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Temple Street Night Market", description: "Famous night market", duration: "1h 30m", location: "Yau Ma Tei", category: "restaurant", order: 1 },
            { id: "stop2", name: "Fa Yuen Street Market", description: "Local food stalls", duration: "1h 30m", location: "Mong Kok", category: "restaurant", order: 2 }
        ]
    },
    {
        name: "Vintage Shopping Hunt",
        description: "Hunt for vintage treasures and unique finds in local shops",
        duration: "2h 45m",
        category: "shopping",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Cat Street Antiques", description: "Vintage antique shops", duration: "1h 30m", location: "Sheung Wan", category: "shopping", order: 1 },
            { id: "stop2", name: "Second-hand Bookstores", description: "Rare book hunting", duration: "1h 15m", location: "Central", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Live Music Venues Tour",
        description: "Discover the local music scene across intimate venues",
        duration: "4h 00m",
        category: "entertainment",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Jazz Club", description: "Intimate jazz performances", duration: "2h", location: "Central", category: "entertainment", order: 1 },
            { id: "stop2", name: "Indie Music Venue", description: "Local band performances", duration: "2h", location: "Causeway Bay", category: "entertainment", order: 2 }
        ]
    },
    {
        name: "Waterfront Cycling Tour",
        description: "Scenic cycling route along the harbor with multiple stops",
        duration: "3h 30m",
        category: "nature",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["bike"],
        itinerary: [
            { id: "stop1", name: "Tsim Sha Tsui Promenade", description: "Harbor cycling path", duration: "1h 30m", location: "Tsim Sha Tsui", category: "nature", order: 1 },
            { id: "stop2", name: "West Kowloon Cultural District", description: "Modern waterfront area", duration: "2h", location: "West Kowloon", category: "nature", order: 2 }
        ]
    },
    {
        name: "Tea Culture Experience",
        description: "Learn about traditional Chinese tea culture and ceremonies",
        duration: "2h 15m",
        category: "culture",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Traditional Tea House", description: "Tea ceremony demonstration", duration: "1h 15m", location: "Central", category: "culture", order: 1 },
            { id: "stop2", name: "Tea Shop Visit", description: "Tea tasting and purchase", duration: "1h", location: "Central", category: "culture", order: 2 }
        ]
    },
    {
        name: "Local Craft Beer Tour",
        description: "Sample craft beers from local breweries and learn brewing process",
        duration: "3h 15m",
        category: "restaurant",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Local Brewery", description: "Craft beer tasting", duration: "1h 30m", location: "Wong Chuk Hang", category: "restaurant", order: 1 },
            { id: "stop2", name: "Beer Garden", description: "Outdoor beer experience", duration: "1h 45m", location: "Central", category: "restaurant", order: 2 }
        ]
    },
    {
        name: "Boutique Shopping Walk",
        description: "Explore unique boutiques and local designer stores",
        duration: "2h 30m",
        category: "shopping",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk"],
        itinerary: [
            { id: "stop1", name: "Local Designer Boutiques", description: "Independent fashion stores", duration: "1h 15m", location: "Central", category: "shopping", order: 1 },
            { id: "stop2", name: "Artisan Craft Shops", description: "Handmade goods", duration: "1h 15m", location: "Sheung Wan", category: "shopping", order: 2 }
        ]
    },
    {
        name: "Comedy & Entertainment Night",
        description: "Experience local comedy shows and entertainment venues",
        duration: "3h 45m",
        category: "entertainment",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Comedy Club", description: "Stand-up comedy show", duration: "2h", location: "Central", category: "entertainment", order: 1 },
            { id: "stop2", name: "Karaoke Lounge", description: "Local karaoke experience", duration: "1h 45m", location: "Causeway Bay", category: "entertainment", order: 2 }
        ]
    },
    {
        name: "Urban Gardening Tour",
        description: "Visit rooftop gardens and urban farming initiatives",
        duration: "2h 45m",
        category: "nature",
        isPremium: false,
        isLocked: false,
        tokenCost: 0,
        transportMode: ["walk", "car"],
        itinerary: [
            { id: "stop1", name: "Rooftop Garden", description: "Urban farming showcase", duration: "1h 30m", location: "Central", category: "nature", order: 1 },
            { id: "stop2", name: "Community Garden", description: "Local gardening initiative", duration: "1h 15m", location: "Wan Chai", category: "nature", order: 2 }
        ]
    }
];

async function seedTrips() {
    console.log("Starting to seed trips...");

    try {
        for (const tripData of sampleTrips) {
            const trip = {
                id: nanoid(),
                name: tripData.name,
                description: tripData.description,
                duration: tripData.duration,
                rating: Math.random() * 2 + 3.5, // Random rating between 3.5 and 5.5
                reviewCount: Math.floor(Math.random() * 200) + 20, // Random review count between 20 and 220
                isPremium: tripData.isPremium,
                isLocked: tripData.isLocked,
                tokenCost: tripData.tokenCost,
                category: tripData.category,
                transportMode: JSON.stringify(tripData.transportMode),
                accessibility: JSON.stringify({
                    visuallyImpaired: Math.random() > 0.5,
                    wheelchairAccessible: Math.random() > 0.3
                }),
                imageUrl: `/api/placeholder/300/200`,
                itinerary: JSON.stringify(tripData.itinerary),
                metadata: JSON.stringify({
                    featured: Math.random() > 0.7,
                    difficulty: Math.random() > 0.5 ? 'easy' : 'moderate'
                }),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.insert(trips).values(trip);
            console.log(`✓ Seeded trip: ${trip.name}`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleTrips.length} trips!`);
    } catch (error) {
        console.error("Error seeding trips:", error);
    }
}

if (require.main === module) {
    seedTrips();
}

export { seedTrips };
