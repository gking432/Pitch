"use client";

import { useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Scene infrastructure                                                */
/* A scene pins for `height` viewports. Content fades + subtly scales   */
/* in, holds dead-still, then fades out. No scroll-linked drift.        */
/* ------------------------------------------------------------------ */

type SceneProps = {
  id?: string;
  className?: string;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
};

function ScrollScene({ id, className = "", height = 1.7, children }: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className={`rf-scene ${className}`} id={id} ref={ref} style={{ minHeight: `${height * 100}vh` }}>
      <div className="rf-sticky">{children(scrollYProgress)}</div>
    </section>
  );
}

/* Fade + subtle scale in/out, staggered by index. No translate, no blur. */
function Reveal({
  progress,
  index = 0,
  hold = 0.8,
  out = 0.96,
  base = 0.05,
  gap = 0.06,
  className = "",
  children
}: {
  progress: MotionValue<number>;
  index?: number;
  hold?: number;
  out?: number;
  base?: number;
  gap?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const a = base + index * gap;
  const b = Math.min(a + 0.12, hold - 0.02);
  const opacity = useTransform(progress, [a, b, hold, out], [0, 1, 1, 0]);
  const scale = useTransform(progress, [a, b, hold, out], [0.94, 1, 1, 1.03]);
  return (
    <motion.div className={className} style={{ opacity, scale }}>
      {children}
    </motion.div>
  );
}

/* Absolute crossfade beat — for sections with two sequential moments. */
function Beat({
  progress,
  win,
  className = "",
  children
}: {
  progress: MotionValue<number>;
  win: [number, number, number, number];
  className?: string;
  children: React.ReactNode;
}) {
  const [a, b, c, d] = win;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const scale = useTransform(progress, [a, b, c, d], [0.94, 1, 1, 1.04]);
  return (
    <motion.div className={`rf-beat ${className}`} style={{ opacity, scale }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="rf-kicker">{children}</span>;
}

/* Generic single-screen section: heading + blocks, all fade in together. */
function DocScene({
  id,
  className = "",
  kicker,
  heading,
  blocks,
  height = 1.6
}: {
  id?: string;
  className?: string;
  kicker: React.ReactNode;
  heading: React.ReactNode;
  blocks: React.ReactNode[];
  height?: number;
}) {
  return (
    <ScrollScene className={`rf-doc-scene ${className}`} height={height} id={id}>
      {(progress) => (
        <div className="rf-doc">
          <Reveal className="rf-doc-head" index={0} progress={progress}>
            <Kicker>{kicker}</Kicker>
            <h2>{heading}</h2>
          </Reveal>
          {blocks.map((block, i) => (
            <Reveal className="rf-doc-block" index={i + 1} key={i} progress={progress}>
              {block}
            </Reveal>
          ))}
        </div>
      )}
    </ScrollScene>
  );
}

/* Hero / closing line stagger (fade + scale). */
function Lines({
  items,
  progress,
  base = 0.18,
  gap = 0.05,
  hold = 0.8,
  out = 0.95,
  className = "rf-lines"
}: {
  items: string[];
  progress: MotionValue<number>;
  base?: number;
  gap?: number;
  hold?: number;
  out?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((line, i) => (
        <Reveal base={base} className="rf-line" gap={gap} hold={hold} index={i} key={i} out={out} progress={progress}>
          {line}
        </Reveal>
      ))}
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
  "Pro shops",
  "Member-guests",
  "Wholesale / retail",
  "College drops",
  "Caddies + PGA pros",
  "Course visits",
  "Editorial content",
  "Creative + AI ops"
];

const memberGuestPlay = [
  "Identify premium clubs with upcoming member-guests.",
  "Reach out months before the event.",
  "Offer custom club-logo socks for every participant.",
  "Treat the first batch as seeding spend.",
  "Club logo outside, Del Campo wordmark on the inside foot.",
  "Give every player a pair.",
  "Follow up with the pro shop after the event.",
  "Convert into reorders, core placement, and future event orders."
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
  "Build-your-pack bundles.",
  "QR codes for custom orders.",
  "Head-pro staff picks.",
  "Limited event designs."
];

const formats = [
  ["Pro Shop Visits", "Talk to pros, study what sells, show where Del Campo fits."],
  ["Course Stories", "Editorial features on clubs, resort courses, munis, and people."],
  ["Inside the Member-Guest", "The event, the tee gift, the custom sock, the follow-up."],
  ["On the Bag", "Caddie stories, tournament weeks, socks visible in real play."],
  ["College Rivalry Golf", "High-energy matches, alumni, rivalry-themed drops."],
  ["Design the Sock", "The custom process for clubs, events, and partners."],
  ["The Best Tee Gift in Golf", "Member-guests, corporate outings, tournament gifting."]
];

const caddiePlay = [
  "Identify respected caddies.",
  "Seed smiley socks and premium core styles.",
  "Offer subtle custom hats where it fits.",
  "Build “On the Bag” content around their stories.",
  "Use visibility as proof, not gimmick.",
  "Recycle the best clips into social, email, and pro shop."
];

const collegePlays = [
  "Rivalry match videos.",
  "Alumni golf weekends.",
  "Campus-color sock drops.",
  "College golfer seeding.",
  "Rivalry-weekend trip packs.",
  "Winner-gets-the-socks formats.",
  "College-themed content series."
];

const plays = [
  ["The Member-Guest Wedge", "Seed custom club-logo socks into premium member-guests, then convert into pro shop placement, reorders, and discovery among serious golfers."],
  ["The Pro Shop Standard", "Custom displays, reorder programs, and club-specific sections that make Del Campo the premium sock standard inside golf shops."],
  ["Del Campo Clubhouse", "A host-led golf culture channel: course visits, pro shops, caddies, member-guests, college rivalries, and custom sock stories."],
  ["On the Bag", "Respected caddies as visible proof. A few recognizable pairs on Sunday can create serious brand memory."],
  ["College Rivalry Golf", "Rivalry matches, alumni weekends, and licensed moments for tasteful, young, low-cost golf content."],
  ["Custom Club Socks", "The core B2B wedge: club logos, tournaments, outings, resort golf, and annual reorders."],
  ["Retail Display Program", "Premium pro shop displays that make Del Campo look like a category leader, not an afterthought."]
];

const modules = [
  ["Growth Command Center", "See the health of the entire marketing engine."],
  ["Campaign Builder", "Plan DTC drops, member-guest programs, retail, and content."],
  ["Relationship CRM", "Manage caddies, club pros, creators, and partners."],
  ["Distribution Pipeline", "Track pro shops, clubs, outings, and custom accounts."],
  ["Creative Studio", "Briefs, content formats, UGC, photo and video needs."],
  ["Performance Dashboard", "Measure what works across every channel."],
  ["AI Action Queue", "Recommend the next best action across the system."]
];

const flywheel = [
  { label: "Discover", copy: "Find the people, clubs, events, and moments that can move the brand.", accent: "var(--rf-neon)" },
  { label: "Seed", copy: "Put the product in the right rooms before asking the market to care.", accent: "var(--rf-gold)" },
  { label: "Create", copy: "Turn each seeded moment into content, proof, and brand memory.", accent: "var(--rf-teal)" },
  { label: "Capture", copy: "Collect the proof, leads, and introductions each activation creates.", accent: "var(--rf-coral)" },
  { label: "Convert", copy: "Turn attention and relationships into revenue.", accent: "var(--rf-neon)" },
  { label: "Recycle", copy: "Use the best-performing proof across every channel.", accent: "var(--rf-gold)" },
  { label: "Expand", copy: "Use every win to open the next relationship, account, or channel.", accent: "var(--rf-teal)" }
];

/* Falling background shapes for the wedge intro. */
const dropShapes = [
  { x: 14, y: 24, size: 150, color: "var(--rf-neon)" },
  { x: 78, y: 18, size: 110, color: "var(--rf-gold)" },
  { x: 64, y: 62, size: 170, color: "var(--rf-teal)" },
  { x: 22, y: 66, size: 120, color: "var(--rf-coral)" },
  { x: 46, y: 34, size: 90, color: "var(--rf-neon)" },
  { x: 86, y: 52, size: 80, color: "var(--rf-teal)" }
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
  const start = 0.16 + index * 0.05;
  const height = useTransform(progress, [start, start + 0.22], ["12%", bar]);
  const opacity = useTransform(progress, [start, start + 0.1, 0.82, 0.95], [0, 1, 1, 0]);
  return (
    <motion.div className="rf-stat" style={{ opacity }}>
      <motion.div className="rf-stat-bar" style={{ height, background: accent }}>
        <strong>{value}</strong>
      </motion.div>
      <p>{label}</p>
    </motion.div>
  );
}

/* Drop-in shape (camera-above): scales down from large, fades out together. */
function DropShape({
  x,
  y,
  size,
  color,
  index,
  progress
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const s = 0.06 + index * 0.03;
  const opacity = useTransform(progress, [s, s + 0.05, 0.4, 0.48], [0, 0.8, 0.8, 0]);
  const scale = useTransform(progress, [s, s + 0.1], [2.1, 1]);
  return (
    <motion.span
      className="rf-drop"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: color,
        opacity,
        scale
      }}
    />
  );
}

/* Marketing-engine network: nucleus + connected token nodes. */
function MarketingNetwork({ progress }: { progress: MotionValue<number> }) {
  const n = tokens.length;
  const radius = 37;
  const nodes = tokens.map((label, i) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { label, x: 50 + radius * Math.cos(ang), y: 50 + radius * Math.sin(ang) };
  });

  return (
    <div className="rf-net">
      <svg className="rf-net-lines" preserveAspectRatio="none" viewBox="0 0 100 100">
        {nodes.map((node, i) => (
          <NetLine index={i} key={i} node={node} progress={progress} />
        ))}
      </svg>

      <NetNucleus progress={progress} />

      {nodes.map((node, i) => (
        <NetNode index={i} key={i} node={node} progress={progress} />
      ))}
    </div>
  );
}

function NetLine({ node, index, progress }: { node: { x: number; y: number }; index: number; progress: MotionValue<number> }) {
  const s = 0.24 + index * 0.03;
  const pathLength = useTransform(progress, [s, s + 0.1], [0, 1]);
  const opacity = useTransform(progress, [s, s + 0.06, 0.86, 0.96], [0, 0.5, 0.5, 0]);
  return (
    <motion.line
      stroke="var(--rf-neon)"
      strokeWidth={0.4}
      style={{ pathLength, opacity }}
      x1={50}
      x2={node.x}
      y1={50}
      y2={node.y}
    />
  );
}

function NetNucleus({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.12, 0.22, 0.86, 0.96], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.12, 0.24], [0.6, 1]);
  return (
    <motion.div className="rf-net-core" style={{ opacity, scale }}>
      <span>Marketing</span>
      <strong>Engine</strong>
    </motion.div>
  );
}

function NetNode({ node, index, progress }: { node: { x: number; y: number; label: string }; index: number; progress: MotionValue<number> }) {
  const s = 0.26 + index * 0.03;
  const opacity = useTransform(progress, [s, s + 0.07, 0.86, 0.96], [0, 1, 1, 0]);
  const scale = useTransform(progress, [s, s + 0.07], [0.5, 1]);
  return (
    <motion.span className="rf-net-node" style={{ left: `${node.x}%`, top: `${node.y}%`, opacity, scale }}>
      {node.label}
    </motion.span>
  );
}

/* Graphic roadmap for "The Play" — connected milestone path. */
function Roadmap({ steps, progress, from, to }: { steps: string[]; progress: MotionValue<number>; from: number; to: number }) {
  const seg = (to - from) / steps.length;
  return (
    <ol className="rf-road">
      {steps.map((step, i) => {
        const s = from + i * seg * 0.85;
        return <RoadStep index={i} key={i} progress={progress} s={s} step={step} />;
      })}
    </ol>
  );
}

function RoadStep({ step, index, progress, s }: { step: string; index: number; progress: MotionValue<number>; s: number }) {
  const opacity = useTransform(progress, [s, s + 0.05], [0, 1]);
  const scale = useTransform(progress, [s, s + 0.05], [0.85, 1]);
  return (
    <motion.li className="rf-road-step" style={{ opacity, scale }}>
      <span className="rf-road-dot">{String(index + 1).padStart(2, "0")}</span>
      <p>{step}</p>
    </motion.li>
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

  const opacity = useTransform(progress, [0, 0.08, 0.93, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.08, 0.93, 1], [0.96, 1, 1, 1.03]);
  const stage = flywheel[active];

  return (
    <motion.div className="rf-fly" style={{ opacity, scale }}>
      <div className="rf-center-copy rf-fly-head">
        <Kicker>The System</Kicker>
        <h2>Growth moves in loops, not one-off campaigns.</h2>
      </div>

      <div className="rf-fly-stage">
        <div className="rf-fly-wheel" aria-hidden>
          <motion.div
            animate={{ rotate: active * (360 / count) }}
            className="rf-fly-pointer"
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
          />
          <div className="rf-fly-hub">
            <strong>Del Campo</strong>
            <span>The premium sock brand golf actually recognizes.</span>
          </div>
          {flywheel.map((item, i) => (
            <div
              className={`rf-fly-blade ${i === active ? "is-active" : ""}`}
              key={item.label}
              style={{ "--a": `${i * (360 / count)}deg`, "--accent": item.accent } as React.CSSProperties}
            >
              <em>{item.label}</em>
            </div>
          ))}
        </div>

        <div className="rf-fly-detail" style={{ borderColor: stage.accent }}>
          <span className="rf-fly-step" style={{ color: stage.accent }}>
            Stage {active + 1} / {count} · {stage.label}
          </span>
          <p className="rf-fly-copy">{stage.copy}</p>
        </div>
      </div>

      <div className="rf-fly-list" aria-hidden>
        {flywheel.map((item, i) => (
          <div className={`rf-fly-card ${i === active ? "is-active" : ""}`} key={item.label} style={{ borderColor: i === active ? item.accent : undefined }}>
            <span style={{ color: item.accent }}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.copy}</p>
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

      {/* 1 — Hero */}
      <ScrollScene className="rf-hero" height={1.9} id="top">
        {(progress) => (
          <div className="rf-doc rf-hero-doc">
            <Reveal index={0} progress={progress}>
              <Kicker>Born on a Florida muni · Made in the USA</Kicker>
            </Reveal>
            <Reveal index={1} progress={progress}>
              <h1 className="rf-hero-title">Own the Sock Drawer.</h1>
            </Reveal>
            <Lines
              base={0.3}
              items={[
                "Golf upgraded the clubs, the shoes, the polos, the hats, the belts, the bags, and the watches.",
                "But every golfer still reaches into the same overlooked drawer before they play.",
                "Del Campo turns that drawer into a position: premium, fun, recognizable golf socks for pro shops, member-guests, caddie yards, and the best clubs in America.",
                "Not a plan to chase attention. A plan to earn presence where golf already trusts what it wears."
              ]}
              progress={progress}
            />
          </div>
        )}
      </ScrollScene>

      {/* 2 — The State of Golf */}
      <ScrollScene className="rf-state" height={1.9} id="state">
        {(progress) => (
          <div className="rf-doc">
            <Reveal className="rf-doc-head" index={0} progress={progress}>
              <Kicker>The State of Golf</Kicker>
              <h2>The game is expanding. The culture is changing.</h2>
            </Reveal>
            <div className="rf-stat-grid">
              {stats.map((stat, index) => (
                <StatBlock {...stat} index={index} key={stat.value} progress={progress} />
              ))}
            </div>
            <Reveal className="rf-source-wrap" hold={0.84} index={5} progress={progress}>
              <p className="rf-source">Source: National Golf Foundation 2025 participation reporting.</p>
            </Reveal>
          </div>
        )}
      </ScrollScene>

      {/* 3 — The Opening */}
      <DocScene
        id="opening"
        kicker="The Opening"
        heading="Golf upgraded everything but the sock drawer."
        blocks={[
          <p className="rf-lead" key="a">Clubs became technology. Shoes became performance. Polos became identity. Hats became collectable. Needlepoint belts became a signal.</p>,
          <p key="b">
            Socks still sit underneath the category — even though they are visible, giftable, customizable, affordable, and perfect for the places golf
            culture spreads: pro shops, member-guests, tournaments, college rivalries, corporate golf, caddie yards, and buddy trips.
          </p>,
          <p className="rf-keyline" key="c">That gap is the opening.</p>,
          <p key="d">
            Del Campo does not need to invent a new behavior. Golfers already wear socks. The job is to make Del Campo the pair they recognize, gift,
            reorder, and look for in the shop.
          </p>
        ]}
      />

      {/* 4 — Why Del Campo */}
      <DocScene
        id="why"
        kicker="Why Del Campo"
        heading="The ingredients already exist."
        blocks={[
          <p key="a">
            Made in America. Distinctive designs. Custom-ready product. Licensed categories. PGA TOUR Fan Shop presence. Big-box distribution. Hundreds of
            pro-shop footholds — a product that already moves through DTC, wholesale, custom events, college drops, tournament gifting, and green grass golf.
          </p>,
          <p className="rf-keyline" key="b">The next step is not more random marketing. It is turning those assets into one public brand story and a repeatable operating system.</p>
        ]}
      />

      {/* 4b — Marketing engine network */}
      <ScrollScene className="rf-net-scene" height={2.1} id="engine-view">
        {(progress) => (
          <div className="rf-doc rf-net-doc">
            <Reveal className="rf-doc-head rf-net-head" index={0} progress={progress}>
              <Kicker>One System</Kicker>
              <h2>Every asset plugs into one engine.</h2>
            </Reveal>
            <MarketingNetwork progress={progress} />
          </div>
        )}
      </ScrollScene>

      {/* 5 — The Position */}
      <DocScene
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
            The tone is golf-native. Confident. Tasteful. A little playful. Built for people who care what they wear, but do not want to look like they are
            trying too hard.
          </p>
        ]}
      />

      {/* 5b — Statement */}
      <ScrollScene className="rf-statement-scene" height={1.6}>
        {(progress) => (
          <Reveal hold={0.82} index={0} progress={progress}>
            <p className="rf-statement">
              Del Campo can become for golf socks what needlepoint belts became for golf accessories: <span>a small item that says a lot.</span>
            </p>
          </Reveal>
        )}
      </ScrollScene>

      {/* 6 — The Member-Guest Wedge (intro w/ falling socks → roadmap) */}
      <ScrollScene className="rf-wedge" height={2.8} id="wedge">
        {(progress) => (
          <div className="rf-doc rf-wedge-doc">
            <Reveal className="rf-doc-head" hold={0.92} index={0} progress={progress}>
              <Kicker>The Wedge</Kicker>
              <h2>Start where serious golf already talks.</h2>
            </Reveal>
            <div className="rf-stage">
              <Beat progress={progress} win={[0.08, 0.18, 0.42, 0.5]}>
                <div className="rf-drops" aria-hidden>
                  {dropShapes.map((shape, i) => (
                    <DropShape {...shape} index={i} key={i} progress={progress} />
                  ))}
                </div>
                <div className="rf-wedge-intro">
                  <p>
                    The member-guest is one of the most valuable rooms in golf: members, guests, business owners, competitive amateurs, and people who
                    notice what everyone else is wearing.
                  </p>
                  <p className="rf-lead">That makes it the perfect wedge for Del Campo.</p>
                </div>
              </Beat>
              <Beat progress={progress} win={[0.5, 0.6, 0.9, 0.98]}>
                <h3 className="rf-sub">The Play</h3>
                <Roadmap from={0.56} progress={progress} steps={memberGuestPlay} to={0.86} />
                <p className="rf-keyline">Custom club socks are not a product. They are a market-entry strategy.</p>
              </Beat>
            </div>
          </div>
        )}
      </ScrollScene>

      {/* 7 — Brand Memory */}
      <DocScene
        id="memory"
        kicker="Brand Memory"
        heading="The club logo gets it worn. The Del Campo name gets it remembered."
        blocks={[
          <p key="a">The smiley can become iconic over time — but today, custom socks need the Del Campo name on them. The logo creates the reason to wear them. The wordmark creates the memory. The comfort creates the reorder.</p>,
          <div key="b">
            <h3 className="rf-sub">Every custom club sock carries three things</h3>
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
      <DocScene
        id="proshop"
        kicker="Green Grass"
        heading="The pro shop is not a sales channel. It is the showroom."
        blocks={[
          <p key="a">Del Campo belongs where golfers already browse before and after a round. The goal is not just to get socks into pro shops — it is to make Del Campo the premium sock standard inside them.</p>,
          <div className="rf-checklist" key="b">
            {proShopList.map((item) => (
              <span className="rf-check" key={item}>
                {item}
              </span>
            ))}
          </div>,
          <p className="rf-keyline" key="c">If the socks look like an afterthought, they sell like one. Del Campo should own the presentation.</p>
        ]}
      />

      {/* 9 — The Media Engine */}
      <DocScene
        height={1.8}
        id="media"
        kicker="Content"
        heading="A classy golf channel, not a bro content house."
        blocks={[
          <p key="a">Content is massive in golf, but Del Campo does not need to become Good Good. The opportunity is a premium, editorial, golf-native layer — one host, one point of view, repeatable formats — that makes Del Campo present inside the culture without cheapening it.</p>,
          <div className="rf-formats" key="b">
            {formats.map(([title, body]) => (
              <div className="rf-format" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        ]}
      />

      {/* 10 — Caddie Visibility (intro → roadmap) */}
      <ScrollScene className="rf-caddie" height={2.6} id="caddie">
        {(progress) => (
          <div className="rf-doc">
            <Reveal className="rf-doc-head" hold={0.92} index={0} progress={progress}>
              <Kicker>On the Bag</Kicker>
              <h2>The best sock visibility may not be on players.</h2>
            </Reveal>
            <div className="rf-stage">
              <Beat progress={progress} win={[0.08, 0.18, 0.42, 0.5]}>
                <div className="rf-wedge-intro">
                  <p>Players wear pants. Caddies wear shorts. That makes caddies one of the most natural visibility channels for a golf sock brand.</p>
                  <p className="rf-lead">A few respected caddies in recognizable Del Campo socks can create more brand memory than a wall of cheap influencer posts.</p>
                </div>
              </Beat>
              <Beat progress={progress} win={[0.5, 0.6, 0.9, 0.98]}>
                <h3 className="rf-sub">The Play</h3>
                <Roadmap from={0.56} progress={progress} steps={caddiePlay} to={0.86} />
                <p className="rf-keyline">Caddies are not vanity influencers. They are culture carriers.</p>
              </Beat>
            </div>
          </div>
        )}
      </ScrollScene>

      {/* 11 — College Rivalry Golf */}
      <DocScene
        id="college"
        kicker="Young Golf"
        heading="College rivalry golf is a low-cost culture wedge."
        blocks={[
          <p key="a">It gives Del Campo a way to create tasteful, fun, repeatable content without turning the brand into a circus — and connects naturally to licensed designs, alumni pride, and younger golfers who care what feels cool.</p>,
          <div className="rf-checklist" key="b">
            {collegePlays.map((item) => (
              <span className="rf-check" key={item}>
                {item}
              </span>
            ))}
          </div>,
          <p className="rf-keyline" key="c">This is where Del Campo can be young without becoming unserious.</p>
        ]}
      />

      {/* 12 — The Growth Flywheel */}
      <ScrollScene className="rf-flywheel" height={4} id="flywheel">
        {(progress) => <GrowthFlywheel progress={progress} />}
      </ScrollScene>

      {/* 13 — The First Strategic Plays */}
      <DocScene
        height={1.9}
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
      <DocScene
        height={1.8}
        id="engine"
        kicker="The Engine"
        heading="The public story needs a private system behind it."
        blocks={[
          <p className="rf-keyline" key="a">The Del Campo Growth Engine turns the strategy into a working system — so the brand compounds instead of running random marketing.</p>,
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

      {/* 15 — Closing */}
      <ScrollScene className="rf-final" height={1.9}>
        {(progress) => (
          <div className="rf-doc">
            <Reveal className="rf-doc-head" index={0} progress={progress}>
              <Kicker>The Where</Kicker>
              <h2>From small sock brand to golf&apos;s most recognizable sock company.</h2>
            </Reveal>
            <Lines
              base={0.22}
              items={[
                "The path is not to become louder. It is to become more present.",
                "Present in the pro shop. At the member-guest. On the caddie. In the college rivalry. In the custom tee gift. In the content serious golfers respect.",
                "Del Campo already has the product. The next step is the system."
              ]}
              progress={progress}
            />
            <Reveal hold={0.85} index={5} progress={progress}>
              <a className="rf-cta" href="/app/command-center">
                Enter the Growth Command Center <ArrowRight size={20} />
              </a>
            </Reveal>
          </div>
        )}
      </ScrollScene>
    </main>
  );
}
