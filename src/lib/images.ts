// Curated high-quality Unsplash images per strategy category
// Each image URL is a stable CDN link — no API key needed

const STRATEGY_IMAGES: Record<string, string[]> = {
  venture: [
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop&q=80", // tech office aerial
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop&q=80", // startup workspace
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop&q=80", // modern office
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&q=80", // team working laptops
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop&q=80", // whiteboard strategy
    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&h=600&fit=crop&q=80", // server room
  ],
  private_equity: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80", // glass skyscraper
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&q=80", // business meeting table
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&q=80", // city skyline dusk
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop&q=80", // corporate hallway
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&h=600&fit=crop&q=80", // financial district
  ],
  buyout: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80", // glass tower
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&h=600&fit=crop&q=80", // NYC skyline
    "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&h=600&fit=crop&q=80", // skyscrapers up
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=600&fit=crop&q=80", // boardroom
  ],
  growth_equity: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80", // data dashboard
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80", // analytics screen
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop&q=80", // growth strategy
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop&q=80", // tech campus
  ],
  real_estate: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop&q=80", // luxury apartment
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=600&fit=crop&q=80", // modern house
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=600&fit=crop&q=80", // commercial building
    "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&h=600&fit=crop&q=80", // city architecture
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&h=600&fit=crop&q=80", // skyline night
  ],
  infrastructure: [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80", // data center
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop&q=80", // wind turbines
    "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&h=600&fit=crop&q=80", // solar panels
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop&q=80", // city infrastructure night
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop&q=80", // highway bridge
  ],
  credit: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop&q=80", // trading screen
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop&q=80", // stock chart
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop&q=80", // money abstract
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&q=80", // financial desk
  ],
  private_credit: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop&q=80",
  ],
  secondaries: [
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&h=600&fit=crop&q=80", // NYC panoramic
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80", // tower
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&h=600&fit=crop&q=80", // wall street
  ],
  hedge_fund: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&q=80",
  ],
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&h=600&fit=crop&q=80",
];

// Deterministic pick based on fund name (same fund = same image)
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getImageForFund(strategy: string | null, fundName: string): string {
  const pool = (strategy && STRATEGY_IMAGES[strategy]) || DEFAULT_IMAGES;
  const idx = hashString(fundName) % pool.length;
  return pool[idx];
}

export function getImagePool(strategy: string | null): string[] {
  return (strategy && STRATEGY_IMAGES[strategy]) || DEFAULT_IMAGES;
}

export function getAllImages(): Record<string, string[]> {
  return { ...STRATEGY_IMAGES, default: DEFAULT_IMAGES };
}
