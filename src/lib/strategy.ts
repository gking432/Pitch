export const productImages = [
  {
    name: "Western Pack",
    src: "https://cdn.shopify.com/s/files/1/0833/1247/6477/files/Western_16a7e0aa-bd05-48b7-aa6e-0e41f02633a2.png?v=1781004907"
  },
  {
    name: "Horseshoe",
    src: "https://cdn.shopify.com/s/files/1/0833/1247/6477/files/HorsehoeMannequin_c808bf7b-6d41-4368-9b62-6e27129f162b.jpg?v=1781004907"
  },
  {
    name: "Cowboy Boot",
    src: "https://cdn.shopify.com/s/files/1/0833/1247/6477/files/CowboyBootsMannequin_d3425ba6-3883-4abc-b0d9-ebaee7713c96.jpg?v=1781004907"
  },
  {
    name: "Freedom Stripe Pack",
    src: "https://cdn.shopify.com/s/files/1/0833/1247/6477/files/FreedomDesign_3_8405680f-c1af-4207-bed4-fc2a06e43ff5.png?v=1779181986"
  }
];

export type StrategyCampaign = {
  id: string;
  title: string;
  thesis: string;
  audience: string;
  strategicRole: string;
  offer: string;
  channels: string[];
  execution: string[];
  creativeDirection: string[];
  targets: string[];
  whyItMatters: string;
};

export const campaigns: StrategyCampaign[] = [
  {
    id: "great-golf-sock-renaissance",
    title: "The Great Golf Sock Renaissance",
    thesis: "Turn the overlooked sock category into Del Campo's public point of view.",
    audience: "Golfers, golf media, Clubhouse members, PGA pros, retail buyers, and anyone tired of bland golf gear.",
    strategicRole: "Brand platform. This is the umbrella idea that makes every product drop and partner conversation feel bigger than socks.",
    offer: "A category manifesto, starter packs, and a public invitation to rethink the golf sock drawer.",
    channels: ["Founder-led organic", "Email/SMS", "PR hooks", "Site narrative", "PGA pro/community channels"],
    execution: [
      "Publish a manifesto-style microsite section that frames socks as collectible, giftable, customizable, and retail-friendly.",
      "Turn Del Campo's real advantages into proof: made in America, licensed categories, PGA TOUR Fan Shop presence, big-box distribution, and 350+ pro shops.",
      "Create a repeatable content format: 'Sock Drawer Audits' for players, caddies, trips, and pro shops.",
      "Use the campaign as the intro language for wholesale, custom, and partnership pitches."
    ],
    creativeDirection: [
      "Editorial sock stills, not generic lifestyle fluff.",
      "Scorecard, fairway, locker-room, and pro-shop counter textures.",
      "Founder voice: confident, funny, and un-corporate."
    ],
    targets: [
      "Increase qualified Clubhouse signups.",
      "Create a reusable brand thesis for sales, PR, email, and paid.",
      "Establish organic content formats that can run weekly."
    ],
    whyItMatters: "Del Campo needs a category claim. This gives the brand something to own before a competitor frames golf socks first."
  },
  {
    id: "sock-of-the-trip",
    title: "Sock of the Trip",
    thesis: "Make Del Campo the official unofficial sock of buddy trips, bachelor trips, and resort golf weekends.",
    audience: "Trip captains, bachelor parties, resort groups, high-frequency recreational golfers, and custom-order prospects.",
    strategicRole: "DTC and custom lead engine. Trip culture creates bundle demand, group-order behavior, UGC, and referral loops.",
    offer: "Trip packs, custom trip socks, quick quote paths, and a group-order playbook.",
    channels: ["Paid social", "Organic social", "Email/SMS", "Custom landing page", "Trip captain referrals"],
    execution: [
      "Build a dedicated landing page around trip packs and custom trip socks.",
      "Run creative tests against three hooks: group gift, custom inside joke, and trip uniform.",
      "Create a short quote path for groups that want logos, dates, nicknames, or course references.",
      "Seed socks to real trip captains in exchange for photos, feedback, and referral intros."
    ],
    creativeDirection: [
      "Suitcase flat lays, cart lineups, morning tee-time chaos, and group sock reveals.",
      "Copy should sound like the group chat, not a luxury catalog.",
      "Actual product and custom examples should do the selling."
    ],
    targets: [
      "Bundle attach rate.",
      "Custom inquiry rate.",
      "Cost per qualified custom lead.",
      "Group-order average value."
    ],
    whyItMatters: "This is the cleanest bridge between DTC, custom socks, UGC, and referral marketing."
  },
  {
    id: "pro-shop-drop",
    title: "The Pro Shop Drop",
    thesis: "Turn existing pro-shop traction into a disciplined green-grass growth motion.",
    audience: "Head pros, assistant pros, merchandisers, club buyers, resort buyers, and PGA professionals.",
    strategicRole: "Distribution engine. This supports wholesale, green grass, custom event sales, and brand legitimacy.",
    offer: "Sample pack, wholesale line sheet, counter display idea, and custom member-guest starter pack.",
    channels: ["PGA Pro Program", "Wholesale outreach", "Email", "LinkedIn", "Events", "Referral intros"],
    execution: [
      "Create one premium pro-shop sell sheet with product proof, margin story, and custom upside.",
      "Build a sample-pack workflow with clear follow-up timing and a next-step menu.",
      "Segment accounts by likely need: checkout impulse, member-guest gifts, resort trip packs, or club-custom socks.",
      "Use existing 350+ pro-shop presence as credibility, then show buyers how to display and reorder."
    ],
    creativeDirection: [
      "Counter display mockups.",
      "Folded product assortments.",
      "Club-color custom concepts.",
      "Short videos showing the sock as an easy checkout add-on."
    ],
    targets: [
      "Sample-pack request rate.",
      "Sample-to-first-order conversion.",
      "First order value.",
      "Custom/tournament inquiry rate from wholesale accounts."
    ],
    whyItMatters: "This shows Del Campo you understand that the role is not only ads and social. Green grass can become a repeatable revenue lane."
  },
  {
    id: "on-the-bag",
    title: "On the Bag",
    thesis: "Use caddies as credible culture carriers, not vanity influencers.",
    audience: "Tour caddies, Korn Ferry caddies, LPGA caddies, golf fans, and serious walking golfers.",
    strategicRole: "Relationship credibility. Caddies create authentic proof around comfort, mileage, and tour proximity.",
    offer: "Caddie Crew seeding kit, referral code, simple photo prompts, and intro incentives.",
    channels: ["Founder outreach", "Caddie referrals", "Organic social", "Email", "Tournament-week content"],
    execution: [
      "Create a small, selective Caddie Crew instead of blasting product to random creators.",
      "Ask for practical proof: walking comfort, bag-room flat lays, tournament-week notes, and honest product feedback.",
      "Turn one caddie relationship into introductions to other caddies, players, assistant pros, and club contacts.",
      "Use caddie content as credibility in paid, product pages, pro-shop sell sheets, and email."
    ],
    creativeDirection: [
      "Yardage books, bag straps, locker rooms, walking fairways, and worn-in product.",
      "Low polish. Real is better here.",
      "No forced influencer scripts."
    ],
    targets: [
      "Activated caddies.",
      "Usable UGC assets.",
      "Referral revenue.",
      "Warm introductions generated."
    ],
    whyItMatters: "This is a believable relationship lane that fits golf culture and avoids expensive influencer vanity."
  },
  {
    id: "clubhouse-custom-pack",
    title: "Clubhouse Custom Pack",
    thesis: "Make custom socks the better tee gift, event gift, and corporate outing item.",
    audience: "Country clubs, tournaments, corporate outing buyers, wedding parties, member-guests, and college golf events.",
    strategicRole: "High-intent lead engine. Custom socks can lift AOV and open business-development conversations.",
    offer: "Custom quote path, mockup examples, event-specific packages, and a simple production timeline.",
    channels: ["Custom landing page", "Email/SMS", "Pro shop partners", "Corporate outreach", "Event partnerships"],
    execution: [
      "Redesign the custom inquiry journey around use cases instead of generic logo upload.",
      "Show four clear use cases: member-guest, corporate outing, bachelor trip, and college/team order.",
      "Build fast mockup templates so leads can see themselves in the product quickly.",
      "Create post-event referral prompts for the next outing, trip, club, or buyer."
    ],
    creativeDirection: [
      "Logo mockups, event tables, groomsmen lineups, tournament gift bags, and before/after examples.",
      "Keep it premium but not stiff.",
      "Make the buying process feel easy."
    ],
    targets: [
      "Qualified custom inquiries.",
      "Lead-to-quote rate.",
      "Quote-to-order rate.",
      "Average custom order value."
    ],
    whyItMatters: "This is where marketing can directly support revenue beyond DTC."
  },
  {
    id: "college-rivalry-drop",
    title: "College Rivalry Drop",
    thesis: "Use licensed product potential around rivalry weekends, alumni golf, and campus pride.",
    audience: "College fans, alumni, college golf programs, students, parents, and retail buyers.",
    strategicRole: "Licensed DTC and retail campaign system.",
    offer: "Limited drops around rivalry weekends, golf events, alumni outings, and school-color bundles.",
    channels: ["Email/SMS", "Paid social", "Organic", "Retail/wholesale", "Alumni partnerships"],
    execution: [
      "Build a drop calendar around football weekends, golf events, graduations, and alumni outings.",
      "Create school-safe creative templates that can be adapted across licensed categories.",
      "Use alumni golf and college golf programs as relationship anchors.",
      "Measure drop sell-through and waitlist demand before scaling school count."
    ],
    creativeDirection: [
      "School-color product stories.",
      "Locker-room and tailgate-adjacent layouts.",
      "Golf bag, campus, and alumni weekend context."
    ],
    targets: [
      "Drop sell-through.",
      "Email/SMS revenue per drop.",
      "School waitlist growth.",
      "Retail/wholesale pull-through signals."
    ],
    whyItMatters: "Licensing can become a repeatable calendar, not a random product collection."
  }
];

export type Playbook = {
  id: string;
  title: string;
  thesis: string;
  audiences: string[];
  strategy: string[];
  assets: string[];
  targets: string[];
};

export const relationshipPlaybooks: Playbook[] = [
  {
    id: "clubs-and-pros",
    title: "Clubs + PGA Professionals",
    thesis: "Treat PGA pros and assistant pros as trust nodes: they can sell, introduce, validate, and shape custom demand.",
    audiences: ["Head professionals", "Assistant pros", "Merchandise buyers", "Teaching pros"],
    strategy: [
      "Build a PGA Pro Program path that feels useful: sample pack, staff discount, custom event guide, and referral credit.",
      "Ask for feedback before asking for promotion.",
      "Create a monthly 'Pro Shop Drop' email that gives pros product stories and display ideas.",
      "Turn strong pros into regional referral anchors."
    ],
    assets: ["PGA pro one-sheet", "Sample-pack insert", "Counter display mockup", "Member-guest custom guide"],
    targets: ["Pro sample requests", "Warm intros", "First orders", "Custom event inquiries"]
  },
  {
    id: "caddies",
    title: "Caddies",
    thesis: "Caddies can provide authentic comfort proof and tour-adjacent credibility without expensive sponsorship theater.",
    audiences: ["PGA TOUR caddies", "Korn Ferry caddies", "LPGA caddies", "Elite amateur caddies"],
    strategy: [
      "Create a selective Caddie Crew with simple asks and no overproduced influencer requirements.",
      "Use caddie feedback to sharpen product claims around walking, sweat, fit, and durability.",
      "Package caddie proof into paid ads, email, product pages, and wholesale collateral.",
      "Reward introductions more than impressions."
    ],
    assets: ["Caddie Crew card", "UGC prompt sheet", "Referral code system", "Tournament-week recap template"],
    targets: ["Usable content", "Referrals", "Product feedback", "Tour-adjacent introductions"]
  },
  {
    id: "golf-creators",
    title: "Golf Creators",
    thesis: "Creators should be used for specific conversion moments, not broad awareness vanity.",
    audiences: ["YouTube golfers", "Short-form creators", "Trip creators", "Course reviewers"],
    strategy: [
      "Start with Sock of the Trip and custom socks, where creator content naturally fits.",
      "Brief creators around one conversion action: bundle buy, custom inquiry, or Clubhouse signup.",
      "Prioritize creators with real golf-trip or community influence over raw follower count.",
      "Recycle creator assets into paid tests only if the hook actually performs."
    ],
    assets: ["Creator brief", "Usage rights checklist", "Offer/code framework", "Paid cutdown templates"],
    targets: ["Cost per usable asset", "Qualified traffic", "Custom inquiries", "Paid creative learnings"]
  },
  {
    id: "players-and-ambassadors",
    title: "Players + Ambassadors",
    thesis: "Players are credibility signals; smaller ambassadors are conversion loops. The strategy should separate those jobs.",
    audiences: ["Tour players", "College golfers", "Mini-tour players", "Card Chasers"],
    strategy: [
      "Use players primarily for proof and product legitimacy.",
      "Use Card Chasers and emerging players for story, content, and referral loops.",
      "Build tiered asks: wear, feedback, content, referral, intro.",
      "Avoid paying for broad sponsorships before the measurement system is ready."
    ],
    assets: ["Ambassador tiers", "Referral guide", "Product feedback form", "Story capture prompts"],
    targets: ["Activated ambassadors", "Proof assets", "Referral sales", "Introductions"]
  },
  {
    id: "trip-captains",
    title: "Trip Captains",
    thesis: "The person organizing the trip is also the buyer, creator, and referral source.",
    audiences: ["Buddy-trip organizers", "Bachelor party planners", "Resort group leaders"],
    strategy: [
      "Build a simple Trip Captain flow with group-order incentive and custom quote path.",
      "Make the product feel like part of the trip identity.",
      "Ask for photos and a referral to next year's organizer or another group.",
      "Use trip content as the bridge between DTC bundles and custom socks."
    ],
    assets: ["Trip pack landing page", "Custom mockup form", "Group-order email", "Post-trip referral prompt"],
    targets: ["Group orders", "Custom leads", "Trip UGC", "Referral loops"]
  }
];

export const distributionPlaybooks: Playbook[] = [
  {
    id: "green-grass",
    title: "Green Grass Pro Shops",
    thesis: "Make Del Campo easy for pro shops to test, display, reorder, and extend into custom events.",
    audiences: ["Country clubs", "Public courses", "Resorts", "PGA professionals"],
    strategy: [
      "Segment shops by use case: checkout impulse, resort trip, member-guest, staff gift, or custom calendar.",
      "Send sample packs only with a follow-up path attached.",
      "Package product into small assortments that reduce buyer risk.",
      "Use custom socks as the upsell after the first wholesale conversation."
    ],
    assets: ["Wholesale line sheet", "Counter display mockup", "Sample-pack workflow", "Member-guest custom guide"],
    targets: ["Sample-pack conversion", "First order value", "Reorder rate", "Custom leads from pro shops"]
  },
  {
    id: "custom-and-corporate",
    title: "Custom + Corporate",
    thesis: "Custom socks should be sold by occasion, not by a generic custom form.",
    audiences: ["Corporate outings", "Tournaments", "Member-guests", "Weddings", "Bachelor trips"],
    strategy: [
      "Create specific pages and examples for each high-intent occasion.",
      "Speed up quote response with reusable mockup templates.",
      "Show production timing clearly to reduce friction.",
      "Use every fulfilled custom order as a referral source."
    ],
    assets: ["Use-case landing pages", "Mockup templates", "Quote response sequence", "Post-order referral email"],
    targets: ["Qualified inquiries", "Lead-to-quote rate", "Quote-to-order rate", "Average order value"]
  },
  {
    id: "retail-and-big-box",
    title: "Retail + Big Box",
    thesis: "Retail growth needs sell-through proof, assortment logic, packaging clarity, and brand story discipline.",
    audiences: ["Big-box buyers", "Regional retail", "Golf specialty retail", "Gift/resort stores"],
    strategy: [
      "Use pro-shop and DTC signals to inform retail assortments.",
      "Build a buyer deck that shows why socks are an easy add-on category.",
      "Keep retail storytelling simple: made in America, golf-specific, distinctive designs, custom/licensed upside.",
      "Support retail with display ideas and seasonal drops."
    ],
    assets: ["Retail buyer deck", "Assortment map", "Packaging/display concepts", "Sell-through reporting template"],
    targets: ["Buyer meetings", "Test orders", "Sell-through", "Retail reorder interest"]
  },
  {
    id: "licensed-drops",
    title: "Licensed Drops",
    thesis: "Licensing becomes powerful when it is attached to a calendar and a fan moment.",
    audiences: ["College fans", "Alumni groups", "Retail buyers", "College golf programs"],
    strategy: [
      "Build a school/drop calendar around rivalry weekends, alumni events, golf trips, and holidays.",
      "Test demand with email/SMS waitlists before overextending inventory.",
      "Create repeatable creative templates for schools and colorways.",
      "Use college golf programs as authentic distribution nodes."
    ],
    assets: ["Drop calendar", "School landing templates", "Waitlist module", "Alumni outreach kit"],
    targets: ["Waitlist demand", "Drop sell-through", "Revenue per send", "School expansion signals"]
  }
];

export const creativeStrategies = [
  {
    title: "Creative Operating System",
    thesis: "Every campaign needs a brief, a shot list, channel outputs, and a reuse plan before production starts.",
    outputs: ["Campaign brief", "Shot list", "Ad matrix", "Email/SMS modules", "Landing page sections", "Sell sheets"]
  },
  {
    title: "Actual Creative Concepts",
    thesis: "Gunnar can make practical creative assets: landing pages, paid ad variations, email sections, sell sheets, mockups, and UGC scripts.",
    outputs: ["Sock of the Trip landing page", "Pro Shop Drop sell sheet", "Custom socks quote page", "Caddie Crew prompt card"]
  },
  {
    title: "Reuse Discipline",
    thesis: "UGC and product proof only matter if they get tagged and redeployed across paid, lifecycle, product pages, and sales collateral.",
    outputs: ["Asset tagging rules", "Usage rights checklist", "Performance notes", "Reuse queue"]
  }
];

export const performanceTargets = [
  {
    strategy: "DTC Demand",
    targets: ["Conversion rate", "AOV", "Bundle attach rate", "Email/SMS revenue share", "Paid CAC / ROAS"]
  },
  {
    strategy: "Custom Socks",
    targets: ["Qualified inquiries", "Lead-to-quote rate", "Quote-to-order rate", "Average custom order value", "Response time"]
  },
  {
    strategy: "Green Grass / Wholesale",
    targets: ["Sample-pack requests", "Sample-to-order conversion", "First order value", "Reorder rate", "Custom leads from shops"]
  },
  {
    strategy: "Relationships",
    targets: ["Activated partners", "Usable proof assets", "Referral revenue", "Warm introductions", "Content reuse rate"]
  },
  {
    strategy: "Creative",
    targets: ["Brief-to-live cycle time", "Assets produced by campaign", "Winning hooks", "Reuse count", "Cost per usable asset"]
  }
];

export const aiIntegrations = [
  {
    title: "Weekly Marketing Brief",
    tools: "Shopify, Klaviyo, GA4, Meta, Google Sheets",
    role: "Pull channel data into one weekly summary with what changed, what matters, and what needs a decision."
  },
  {
    title: "Campaign Brief Generator",
    tools: "Notion/Airtable, product catalog, past campaigns",
    role: "Generate first-draft campaign briefs, channel checklists, shot lists, and KPI targets from a selected strategy."
  },
  {
    title: "Custom Quote Copilot",
    tools: "Website form, CRM, email, mockup templates",
    role: "Classify custom inquiries by occasion, draft replies, suggest mockup direction, and flag high-value leads."
  },
  {
    title: "Relationship Outreach Assistant",
    tools: "CRM, email, social research, referral codes",
    role: "Draft personalized outreach for pros, caddies, creators, trip captains, and alumni groups without sounding mass-produced."
  },
  {
    title: "Creative Asset Tagger",
    tools: "Drive/Dropbox, ad account, product catalog",
    role: "Tag assets by campaign, hook, audience, product, permission status, and best reuse channel."
  },
  {
    title: "Pro Shop Follow-up System",
    tools: "CRM, email, sample-pack tracker, wholesale sheet",
    role: "Track sample packs and trigger follow-ups so wholesale opportunities do not die after the first send."
  }
];
