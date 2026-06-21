"use client";

import { useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Pinned scene infrastructure (cinematic "page holds still" moments)  */
/* ------------------------------------------------------------------ */

type SceneProps = {
  id?: string;
  className?: string;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
};

function ScrollScene({ id, className = "", height = 1.9, children }: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className={`rf-scene ${className}`} id={id} ref={ref} style={{ minHeight: `${height * 100}vh` }}>
      <div className="rf-sticky">{children(scrollYProgress)}</div>
    </section>
  );
}

function SceneBody({
  progress,
  children,
  enter = 0.16,
  exit = 0.82,
  travel = 56
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
  enter?: number;
  exit?: number;
  travel?: number;
}) {
  const opacity = useTransform(progress, [0, enter, exit, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, enter, exit, 1], [travel, 0, 0, -travel]);
  const filter = useTransform(progress, [0, enter, exit, 1], ["blur(7px)", "blur(0px)", "blur(0px)", "blur(7px)"]);
  return (
    <motion.div className="rf-body" style={{ opacity, y, filter }}>
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  progress,
  index,
  start = 0.2,
  step = 0.05,
  className
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  start?: number;
  step?: number;
  className?: string;
}) {
  const begin = start + index * step;
  const opacity = useTransform(progress, [begin, begin + 0.16], [0, 1]);
  const y = useTransform(progress, [begin, begin + 0.16], [30, 0]);
  return (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

function Lines({
  items,
  progress,
  start = 0.22,
  step = 0.05,
  className = "rf-lines"
}: {
  items: string[];
  progress: MotionValue<number>;
  start?: number;
  step?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((line, i) => (
        <Stagger className="rf-line" index={i} key={i} progress={progress} start={start} step={step}>
          {line}
        </Stagger>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal scene: a PINNED section whose heading holds while the body    */
/* reveals one block at a time as you scroll, then hands to the next.   */
/* ------------------------------------------------------------------ */

function RevealBlock({
  index,
  total,
  progress,
  children
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const lo = 0.1;
  const hi = 0.96;
  const seg = (hi - lo) / total;
  const s = lo + index * seg;
  const isLast = index === total - 1;
  const opacity = useTransform(
    progress,
    isLast ? [s, s + seg * 0.32, 1, 1] : [s, s + seg * 0.32, s + seg * 0.84, s + seg],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [s, s + seg * 0.32], [30, 0]);
  const filter = useTransform(progress, [s, s + seg * 0.32], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.div className="rf-rs-block" style={{ opacity, y, filter }}>
      {children}
    </motion.div>
  );
}

function RevealScene({
  id,
  className = "",
  kicker,
  heading,
  blocks
}: {
  id?: string;
  className?: string;
  kicker: React.ReactNode;
  heading: React.ReactNode;
  blocks: React.ReactNode[];
}) {
  const n = blocks.length;
  const height = Math.min(1.2 + n * 0.55, 4.4);
  return (
    <ScrollScene className={`rf-rs-scene ${className}`} height={height} id={id}>
      {(progress) => {
        const headOpacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
        const headY = useTransform(progress, [0, 0.05, 0.95, 1], [34, 0, 0, -34]);
        return (
          <div className="rf-rs">
            <motion.div className="rf-rs-head" style={{ opacity: headOpacity, y: headY }}>
              <Kicker>{kicker}</Kicker>
              <h2>{heading}</h2>
            </motion.div>
            <div className="rf-rs-stage">
              {blocks.map((block, i) => (
                <RevealBlock index={i} key={i} progress={progress} total={n}>
                  {block}
                </RevealBlock>
              ))}
            </div>
          </div>
        );
      }}
    </ScrollScene>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="rf-kicker">{children}</span>;
}

/* Labeled placeholder where a real brand asset belongs. */
function ImageSlot({ label, ratio = "16 / 9", className = "" }: { label: string; ratio?: string; className?: string }) {
  return (
    <div className={`rf-slot ${className}`} style={{ aspectRatio: ratio }} aria-hidden>
      <span className="rf-slot-tag">Image</span>
      <span className="rf-slot-label">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "48.1M", label: "Americans played golf on-course or off-course in 2025.", bar: "72%", accent: "var(--rf-neon)" },
  { value: "29.1M", label: "People played traditional on-course golf.", bar: "52%", accent: "var(--rf-gold)" },
  { value: "19M", label: "People only played off-course golf: ranges, simulators, and entertainment venues.", bar: "42%", accent: "var(--rf-teal)" },
  { value: "8.1M", label: "Women and girls played on-course golf, matching a record share.", bar: "34%", accent: "var(--rf-coral)" }
];

const tokens = [
  "DTC demand",
  "Custom club socks",
  "Green grass pro shops",
  "Member-guests",
  "Wholesale / retail",
  "College licensed drops",
  "Caddies + PGA pros",
  "Course visits",
  "Creator/editorial content",
  "Creative + AI operations"
];

const memberGuestPlay = [
  "Identify premium clubs with upcoming member-guests.",
  "Reach out months before the event.",
  "Offer custom club-logo Del Campo socks for every participant.",
  "Treat the first batch as marketing spend or a deeply discounted seeding program.",
  "Put the club logo on the sock, but make sure the Del Campo wordmark is visible on the inside foot.",
  "Give every player a pair.",
  "Follow up with the pro shop after the event.",
  "Convert the moment into custom reorders, core Del Campo placement, and future tournament/event orders."
];

const productRule = [
  ["The club mark", "So the member wants to wear it."],
  ["The Del Campo wordmark", "So the wearer knows who made it."],
  ["A subtle brand cue", "So the sock becomes recognizable over time."]
];

const proShopList = [
  "Custom countertop displays.",
  "Club-logo sock sections.",
  "Member-guest reorder programs.",
  "Seasonal club drops.",
  "Resort golf packs.",
  "Build-your-pack pro shop bundles.",
  "QR codes for custom orders.",
  "Staff picks from the head pro.",
  "Limited designs tied to club events."
];

const formats = [
  ["Pro Shop Visits", "Visit great golf shops, talk to pros, study what sells, and show where Del Campo fits."],
  ["Course Stories", "Short editorial features on clubs, resort courses, munis, and the people who make them."],
  ["Inside the Member-Guest", "Tell the story of the event, the tee gift, the custom sock, and the pro shop follow-up."],
  ["On the Bag", "Caddie stories, tournament weeks, travel, and the socks visible in real play."],
  ["College Rivalry Golf", "Low-cost, high-energy matches with college golfers, alumni, and rivalry-themed sock drops."],
  ["Design the Sock", "Show the custom sock process for clubs, events, and partners."],
  ["The Best Tee Gift in Golf", "A recurring series around member-guests, corporate outings, and tournament gifting."]
];

const caddiePlay = [
  "Identify respected caddies.",
  "Seed smiley socks and premium core styles.",
  "Offer subtle custom hats where appropriate.",
  "Build “On the Bag” content around their stories.",
  "Use caddie visibility as proof, not gimmick.",
  "Recycle the best photos and clips into social, email, and pro shop materials."
];

const collegePlays = [
  "Rivalry match videos.",
  "Alumni golf weekends.",
  "Campus-color sock drops.",
  "College golfer seeding.",
  "Golf trip packs for rivalry weekends.",
  "Winner-gets-the-socks formats.",
  "Limited college-themed content series."
];

const plays = [
  ["The Member-Guest Wedge", "Seed custom club-logo socks into premium member-guests, then convert the event into pro shop placement, custom reorders, and brand discovery among serious golfers."],
  ["The Pro Shop Standard", "Build custom displays, reorder programs, and club-specific sock sections that make Del Campo feel like the premium sock standard inside golf shops."],
  ["Del Campo Clubhouse", "Create a host-led golf culture channel built around course visits, pro shops, caddies, member-guests, college rivalries, and custom sock stories."],
  ["On the Bag", "Use high-level caddies as visible proof. Socks show when caddies wear shorts. A few respected caddies in recognizable Del Campo socks can create serious brand memory."],
  ["College Rivalry Golf", "Use college rivalry matches, alumni weekends, and licensed product moments to create tasteful, young, low-cost golf content."],
  ["Custom Club Socks", "Turn custom socks into the core B2B wedge: club logos, tournaments, member-guests, corporate outings, resort golf, and annual reorders."],
  ["Retail Display Program", "Design premium pro shop displays that make Del Campo look like a category leader, not an accessory hanging on a forgotten rack."]
];

const modules = [
  ["Growth Command Center", "See the health of the entire marketing engine."],
  ["Campaign Builder", "Plan DTC drops, member-guest programs, retail pushes, college drops, and content campaigns."],
  ["Relationship CRM", "Manage caddies, club pros, creators, college golfers, and strategic partners."],
  ["Distribution Pipeline", "Track pro shops, country clubs, corporate outings, custom sock accounts, and wholesale opportunities."],
  ["Creative Studio", "Organize briefs, content formats, UGC, photo/video needs, and retail assets."],
  ["Performance Dashboard", "Measure what is working across DTC, wholesale, custom, content, and relationships."],
  ["AI Action Queue", "Recommend the next best action across the whole growth system."]
];

const flywheel = [
  {
    label: "Discover",
    copy: "Find the people, accounts, clubs, events, and moments that can move the brand.",
    action: "Score member-guests, caddies, club pros, creators, college golfers, and pro-shop prospects by fit, reach, credibility, and revenue potential.",
    modules: "Relationship CRM · Distribution Pipeline",
    metric: "Qualified prospects added per week",
    accent: "var(--rf-neon)"
  },
  {
    label: "Seed",
    copy: "Put the product in the right rooms before asking the market to care.",
    action: "Send custom club-logo socks to a premium member-guest and make sure the Del Campo wordmark is visible on the inside foot.",
    modules: "Distribution Pipeline · Campaign Builder · Creative Studio",
    metric: "Seeded events and sample packs placed",
    accent: "var(--rf-gold)"
  },
  {
    label: "Create",
    copy: "Turn each seeded moment into content, proof, and brand memory.",
    action: "Film a pro shop visit, capture the custom sock story, and produce short-form clips for the Del Campo Clubhouse channel.",
    modules: "Creative Studio · Campaign Builder · Relationship CRM",
    metric: "Content assets created per activation",
    accent: "var(--rf-teal)"
  },
  {
    label: "Capture",
    copy: "Collect the proof, leads, feedback, and introductions each activation creates.",
    action: "Turn a caddie’s on-course sock photo into an approved UGC asset with reuse rights.",
    modules: "Creative Studio · Relationship CRM · Distribution Pipeline",
    metric: "UGC assets, leads, and introductions captured",
    accent: "var(--rf-coral)"
  },
  {
    label: "Convert",
    copy: "Turn attention and relationships into revenue.",
    action: "Route a member-guest sock placement into a pro shop reorder, custom club sock program, or DTC follow-up.",
    modules: "Campaign Builder · Distribution Pipeline · Performance Dashboard",
    metric: "Revenue, reorders, and accounts closed",
    accent: "var(--rf-neon)"
  },
  {
    label: "Recycle",
    copy: "Use the best-performing proof across every growth channel.",
    action: "Turn member-guest photos into paid ads, email content, a pro shop sell sheet, and a custom sock landing page.",
    modules: "Creative Studio · Campaign Builder · Performance Dashboard · AI Action Queue",
    metric: "Assets reused across channels",
    accent: "var(--rf-gold)"
  },
  {
    label: "Expand",
    copy: "Use every win to open the next relationship, account, or channel.",
    action: "Use a successful pro-shop sample program to trigger outreach to five similar clubs with upcoming member-guests.",
    modules: "Command Center · AI Action Queue · Relationship CRM · Distribution Pipeline",
    metric: "Referrals and new accounts opened",
    accent: "var(--rf-teal)"
  }
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function StatBlock({
  value,
  label,
  bar,
  accent,
  index,
  progress
}: {
  value: string;
  label: string;
  bar: string;
  accent: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.2 + index * 0.05;
  const height = useTransform(progress, [start, start + 0.28], ["14%", bar]);
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const y = useTransform(progress, [start, start + 0.12], [28, 0]);
  return (
    <motion.div className="rf-stat" style={{ opacity, y }}>
      <motion.div className="rf-stat-bar" style={{ height, background: accent }}>
        <strong>{value}</strong>
      </motion.div>
      <p>{label}</p>
    </motion.div>
  );
}

function GrowthFlywheel({ progress }: { progress: MotionValue<number> }) {
  const count = flywheel.length;
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (p) => {
    const t = (p - 0.14) / (0.9 - 0.14);
    const idx = Math.max(0, Math.min(count - 1, Math.floor(t * count)));
    setActive(idx);
  });

  const groupOpacity = useTransform(progress, [0, 0.08, 0.94, 1], [0, 1, 1, 0]);
  const groupY = useTransform(progress, [0, 0.08, 0.94, 1], [56, 0, 0, -56]);
  const stage = flywheel[active];

  return (
    <motion.div className="rf-fly" style={{ opacity: groupOpacity, y: groupY }}>
      <div className="rf-center-copy rf-fly-head">
        <Kicker>The System</Kicker>
        <h2>Growth moves in loops, not one-off campaigns.</h2>
      </div>

      <div className="rf-fly-stage">
        <div className="rf-fly-wheel" aria-hidden>
          <motion.div
            className="rf-fly-pointer"
            animate={{ rotate: active * (360 / count) }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          />
          <div className="rf-fly-hub">
            <strong>Del Campo</strong>
            <span>The premium sock brand golf actually recognizes.</span>
          </div>
          {flywheel.map((s, i) => (
            <div
              className={`rf-fly-blade ${i === active ? "is-active" : ""}`}
              key={s.label}
              style={{ "--a": `${i * (360 / count)}deg`, "--accent": s.accent } as React.CSSProperties}
            >
              <em>{s.label}</em>
            </div>
          ))}
        </div>

        <div className="rf-fly-detail" style={{ borderColor: stage.accent }}>
          <span className="rf-fly-step" style={{ color: stage.accent }}>
            Stage {active + 1} / {count} · {stage.label}
          </span>
          <p className="rf-fly-copy">{stage.copy}</p>
          <div className="rf-fly-meta">
            <span className="rf-fly-meta-label">Example action</span>
            <p>{stage.action}</p>
          </div>
          <div className="rf-fly-meta-row">
            <div>
              <span className="rf-fly-meta-label">Modules</span>
              <p>{stage.modules}</p>
            </div>
            <div>
              <span className="rf-fly-meta-label">Success metric</span>
              <p>{stage.metric}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rf-fly-list" aria-hidden>
        {flywheel.map((s, i) => (
          <div className={`rf-fly-card ${i === active ? "is-active" : ""}`} key={s.label} style={{ borderColor: i === active ? s.accent : undefined }}>
            <span style={{ color: s.accent }}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <strong>{s.label}</strong>
              <p>{s.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="rf-page">
      <div className="rf-backdrop" aria-hidden />

      {/* 1 — Hero (pinned) */}
      <ScrollScene className="rf-hero" height={2} id="top">
        {(progress) => {
          const cueOpacity = useTransform(progress, [0, 0.16, 0.3], [1, 0.6, 0]);
          return (
            <>
              <SceneBody progress={progress}>
                <div className="rf-center-copy">
                  <Kicker>Born on a Florida muni. Made in the USA.</Kicker>
                  <h1>Own the Sock Drawer.</h1>
                  <Lines
                    items={[
                      "Golf has upgraded the clubs, the shoes, the polos, the hats, the belts, the bags, and the watches.",
                      "But every golfer still reaches into the same overlooked drawer before they play.",
                      "Del Campo can turn that drawer into a brand position: premium, fun, recognizable golf socks that belong in pro shops, member-guests, caddie yards, college rivalries, and the best clubs in America.",
                      "This is not a plan to chase attention. It is a plan to earn presence where golf culture already trusts what it wears."
                    ]}
                    progress={progress}
                    start={0.2}
                    step={0.06}
                  />
                </div>
              </SceneBody>
              <motion.div className="rf-scroll" style={{ opacity: cueOpacity }}>
                <span>Scroll to see the strategy</span>
                <ChevronDown size={20} />
              </motion.div>
            </>
          );
        }}
      </ScrollScene>

      {/* 2 — The State of Golf (pinned) */}
      <ScrollScene className="rf-state" height={2.2} id="state">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <Kicker>The State of Golf</Kicker>
              <h2>The game is expanding. The culture is changing.</h2>
            </div>
            <div className="rf-stat-grid">
              {stats.map((stat, index) => (
                <StatBlock {...stat} index={index} key={stat.value} progress={progress} />
              ))}
            </div>
            <p className="rf-source">Source: National Golf Foundation 2025 participation reporting.</p>
          </SceneBody>
        )}
      </ScrollScene>

      {/* 3 — The Opening */}
      <RevealScene
        id="opening"
        kicker="The Opening"
        heading="Golf upgraded everything but the sock drawer."
        blocks={[
          <p className="rf-lead" key="a">Clubs became technology. Shoes became performance. Polos became identity. Hats became collectable. Needlepoint belts became a signal.</p>,
          <p key="b">
            Socks still sit underneath the category, even though they are visible, giftable, customizable, affordable, and perfect for the places golf
            culture actually spreads: pro shops, member-guests, tournaments, college rivalries, corporate golf, caddie yards, and buddy trips.
          </p>,
          <p className="rf-keyline rf-keyline--lg" key="c">That gap is the opening.</p>,
          <p key="d">
            Del Campo does not need to invent a new behavior. Golfers already wear socks. The job is to make Del Campo the pair they recognize, talk about,
            gift, reorder, and look for in the shop.
          </p>
        ]}
      />

      {/* 4 — Why Del Campo */}
      <RevealScene
        id="why"
        kicker="Why Del Campo"
        heading="The ingredients already exist."
        blocks={[
          <p key="a">
            Made in America. Distinctive designs. Custom-ready product. Licensed categories. PGA TOUR Fan Shop presence. Big-box distribution. Hundreds of
            pro-shop footholds. A product that can move through DTC, wholesale, custom events, college drops, tournament gifting, and green grass golf.
          </p>,
          <p className="rf-keyline rf-keyline--lg" key="b">The next step is not more random marketing. It is turning those assets into a public brand story and a repeatable operating system.</p>,
          <div className="rf-token-field" key="c">
            {tokens.map((item) => (
              <span className="rf-token" key={item}>
                {item}
              </span>
            ))}
          </div>
        ]}
      />

      {/* 5 — The Position */}
      <RevealScene
        id="position"
        kicker="The Position"
        heading="Premium. Classy. Fun. Recognizable."
        blocks={[
          <p key="a">Del Campo should not become another loud golf content brand.</p>,
          <p key="b">
            It should become the sock brand that feels at home at a top club, a member-guest, a college rivalry weekend, a resort pro shop, and a
            caddie&apos;s ankles on Sunday afternoon.
          </p>,
          <p key="c">
            The tone is not chaos. The tone is golf-native. Confident. Tasteful. A little playful. Built for people who care what they wear, but do not want
            to look like they are trying too hard.
          </p>
        ]}
      />

      {/* 5b — Statement (pinned) */}
      <ScrollScene className="rf-statement-scene" height={1.7}>
        {(progress) => (
          <SceneBody progress={progress}>
            <p className="rf-statement">
              Del Campo can become for golf socks what needlepoint belts became for golf accessories: <span>a small item that says a lot.</span>
            </p>
          </SceneBody>
        )}
      </ScrollScene>

      {/* 6 — The Member-Guest Wedge */}
      <RevealScene
        id="wedge"
        kicker="The Wedge"
        heading="Start where serious golf already talks."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>
              The member-guest is one of the most valuable rooms in golf. It brings together club members, guests, business owners, competitive amateurs,
              local leaders, traveling players, and people who notice what everyone else is wearing.
            </p>
            <p>That makes it the perfect wedge for Del Campo.</p>
          </div>,
          <ImageSlot key="b" label="Custom club-logo sock mockup — club logo on the outside, Del Campo wordmark on the inside foot" ratio="3 / 2" />,
          <div key="c">
            <h3 className="rf-sub">The Play</h3>
            <ol className="rf-steps">
              {memberGuestPlay.map((step, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>,
          <p className="rf-keyline rf-keyline--lg" key="d">Custom club socks are not just a product. They are a market-entry strategy.</p>
        ]}
      />

      {/* 7 — Brand Memory Detail */}
      <RevealScene
        id="memory"
        kicker="Brand Memory"
        heading="The club logo gets them to wear it. The Del Campo name gets them to remember it."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>The smiley can become iconic over time. But today, custom socks need the Del Campo name on them.</p>
            <p>The club logo creates the reason to wear them. The Del Campo wordmark creates the brand memory. The comfort creates the reorder.</p>
          </div>,
          <ImageSlot key="b" label="Sock detail — club mark + visible Del Campo wordmark + subtle recurring brand cue" ratio="3 / 2" />,
          <div key="c">
            <h3 className="rf-sub">Every custom country club sock should carry three things</h3>
            <div className="rf-rule">
              {productRule.map(([title, body]) => (
                <div className="rf-rule-card" key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        ]}
      />

      {/* 8 — The Pro Shop Standard */}
      <RevealScene
        id="proshop"
        kicker="Green Grass"
        heading="The pro shop is not just a sales channel. It is the showroom."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>Del Campo belongs where golfers already browse before and after a round.</p>
            <p>The goal is not simply to get socks into pro shops. The goal is to make Del Campo look like the premium sock standard inside the pro shop.</p>
          </div>,
          <ImageSlot key="b" label="Pro shop countertop / sock wall display mockup" ratio="16 / 9" />,
          <div key="c">
            <h3 className="rf-sub">What this looks like</h3>
            <div className="rf-checklist">
              {proShopList.map((item) => (
                <span className="rf-check" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>,
          <p className="rf-keyline rf-keyline--lg" key="d">If the socks look like an afterthought, they sell like an afterthought. Del Campo should own the sock presentation.</p>
        ]}
      />

      {/* 9 — The Media Engine */}
      <RevealScene
        id="media"
        kicker="Content"
        heading="Build a classy golf channel, not a bro content house."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>
              Content is massive in golf, but Del Campo does not need to become Good Good. The opportunity is a more premium, editorial, golf-native content
              layer: one host, one point of view, and repeatable formats that make Del Campo present inside the culture without cheapening the brand.
            </p>
            <p>The product is socks. The story is where those socks show up.</p>
          </div>,
          <div className="rf-channel" key="b">
            <span className="rf-channel-label">Channel concept</span>
            <strong>Del Campo Clubhouse</strong>
            <p>A host-led golf culture channel built around courses, pro shops, caddies, member-guests, college rivalries, and custom sock stories.</p>
            <ImageSlot className="rf-channel-slot" label="Del Campo Clubhouse — channel still / episode thumbnail" ratio="16 / 9" />
          </div>,
          <div key="c">
            <h3 className="rf-sub">Possible formats</h3>
            <div className="rf-formats">
              {formats.map(([title, body]) => (
                <div className="rf-format" key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>,
          <p className="rf-keyline rf-keyline--lg" key="d">The content should make Del Campo feel like it belongs in serious golf culture. Not above it. Not outside it. Inside it.</p>
        ]}
      />

      {/* 10 — Caddie Visibility */}
      <RevealScene
        id="caddie"
        kicker="On the Bag"
        heading="The best sock visibility may not be on players."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>Players often wear pants. Caddies often wear shorts. That makes caddies one of the most natural visibility channels for a golf sock brand.</p>
            <p>
              A few high-level caddies wearing recognizable Del Campo socks during tournament play could create more visible brand memory than a larger
              number of lower-quality influencer posts.
            </p>
          </div>,
          <ImageSlot key="b" label="Caddie on the bag, tournament setting — Del Campo socks visible with shorts" ratio="16 / 9" />,
          <div key="c">
            <h3 className="rf-sub">The Play</h3>
            <ol className="rf-steps">
              {caddiePlay.map((step, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>,
          <p className="rf-keyline rf-keyline--lg" key="d">Caddies are not vanity influencers. They are culture carriers.</p>
        ]}
      />

      {/* 11 — College Rivalry Golf */}
      <RevealScene
        id="college"
        kicker="Young Golf"
        heading="College golf is a low-cost content and culture wedge."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>College rivalry golf gives Del Campo a way to create tasteful, fun, repeatable content without turning the brand into a circus.</p>
            <p>It also connects naturally to licensed designs, alumni pride, campus weekends, and younger golfers who still care about what feels cool.</p>
          </div>,
          <ImageSlot key="b" label="College rivalry sock drop — campus colors / matchup" ratio="16 / 9" />,
          <div key="c">
            <h3 className="rf-sub">Possible plays</h3>
            <div className="rf-checklist">
              {collegePlays.map((item) => (
                <span className="rf-check" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>,
          <p className="rf-keyline rf-keyline--lg" key="d">This is where Del Campo can be young without becoming unserious.</p>
        ]}
      />

      {/* 12 — The Growth Flywheel (pinned) */}
      <ScrollScene className="rf-flywheel" height={4} id="flywheel">
        {(progress) => <GrowthFlywheel progress={progress} />}
      </ScrollScene>

      {/* 13 — The First Strategic Plays */}
      <RevealScene
        id="plays"
        kicker="The First Moves"
        heading="Campaigns become the operating system."
        blocks={[
          <div className="rf-plays" key="a">
            {plays.map(([title, body], i) => (
              <div className="rf-play" key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        ]}
      />

      {/* 14 — The Operating System */}
      <RevealScene
        id="engine"
        kicker="The Engine"
        heading="The public story needs a private system behind it."
        blocks={[
          <div className="rf-block-text" key="a">
            <p>
              A vision only matters if it can be operated. The Del Campo Growth Engine turns the strategy into a working system: campaigns, relationships,
              pro-shop accounts, custom sock opportunities, creative briefs, content assets, performance metrics, and AI-assisted next actions.
            </p>
            <p className="rf-keyline">This is how Del Campo avoids random marketing. This is how the brand compounds.</p>
          </div>,
          <div className="rf-modules" key="b">
            {modules.map(([title, body]) => (
              <div className="rf-module" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        ]}
      />

      {/* 15 — Closing (pinned) */}
      <ScrollScene className="rf-final" height={2.1}>
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <Kicker>The Where</Kicker>
              <h2>From small sock brand to golf&apos;s most recognizable sock company.</h2>
              <Lines
                items={[
                  "The path is not to become louder. The path is to become more present.",
                  "Present in the pro shop. Present at the member-guest. Present on the caddie. Present in the college rivalry. Present in the custom tee gift. Present in the content serious golfers actually respect.",
                  "Del Campo already has the product. The next step is the system."
                ]}
                progress={progress}
                start={0.2}
                step={0.07}
              />
              <Stagger className="rf-cta-wrap" index={0} progress={progress} start={0.62} step={0}>
                <a className="rf-cta" href="/app/command-center">
                  Enter the Growth Command Center <ArrowRight size={20} />
                </a>
              </Stagger>
            </div>
          </SceneBody>
        )}
      </ScrollScene>
    </main>
  );
}
