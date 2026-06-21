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
  hold = 0.85,
  out = 0.97,
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
  { value: "48.1M", label: "Americans played golf on- or off-course in 2025.", accent: "var(--rf-neon)" },
  { value: "29.1M", label: "Played traditional on-course golf.", accent: "var(--rf-gold)" },
  { value: "19M", label: "Played off-course only — ranges, sims, and venues.", accent: "var(--rf-teal)" },
  { value: "8.1M", label: "Women and girls on-course, a record share.", accent: "var(--rf-coral)" }
];

const PILLARS = ["Events", "Green Grass", "Ambassadors", "Content", "Retail"];

/* Large pillar nodes: scattered network position [x%, y%] -> top-bar slot. */
const engineNodes = [
  { label: "Events", accent: "var(--rf-neon)", net: [20, 40], size: 104 },
  { label: "Green Grass", accent: "var(--rf-gold)", net: [50, 62], size: 116 },
  { label: "Ambassadors", accent: "var(--rf-teal)", net: [76, 34], size: 108 },
  { label: "Content", accent: "var(--rf-coral)", net: [34, 76], size: 96 },
  { label: "Retail", accent: "var(--rf-neon)", net: [84, 70], size: 100 }
];

/* Smaller supporting nodes that live behind the five and fade on morph. */
const subNodes = [
  { label: "Member-guests", parent: 0, net: [8, 24], size: 52 },
  { label: "Tournaments", parent: 0, net: [10, 56], size: 44 },
  { label: "Outings", parent: 0, net: [30, 18], size: 42 },
  { label: "Pro shops", parent: 1, net: [44, 84], size: 50 },
  { label: "Reorders", parent: 1, net: [62, 80], size: 42 },
  { label: "Caddies", parent: 2, net: [90, 16], size: 48 },
  { label: "College", parent: 2, net: [70, 14], size: 44 },
  { label: "Creators", parent: 3, net: [20, 90], size: 44 },
  { label: "Course stories", parent: 3, net: [46, 92], size: 42 },
  { label: "DTC", parent: 4, net: [95, 48], size: 42 },
  { label: "Wholesale", parent: 4, net: [94, 86], size: 44 },
  { label: "Fan Shop", parent: 4, net: [72, 84], size: 44 }
];

/* Chain links between the five large nodes. */
const engineLinks = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [0, 3]
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const memberGuestPlay = [
  "Identify premium clubs with upcoming member-guests.",
  "Reach out months before the event.",
  "Offer custom club-logo socks for every participant.",
  "Treat the first batch as seeding spend.",
  "Club logo outside, Del Campo wordmark on the inside foot.",
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

const collegePlays = [
  "Rivalry match videos.",
  "Alumni golf weekends.",
  "Campus-color sock drops.",
  "College golfer seeding.",
  "Rivalry-weekend trip packs.",
  "College-themed content series."
];

const retailList = [
  "Direct-to-consumer drops.",
  "Wholesale & specialty retail.",
  "Big-box distribution.",
  "PGA TOUR Fan Shop.",
  "Licensed categories.",
  "Custom & corporate orders."
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

/* Falling background shapes for the events intro. */
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
  accent,
  index,
  progress
}: {
  value: string;
  label: string;
  accent: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.16 + index * 0.06;
  const opacity = useTransform(progress, [start, start + 0.12, 0.84, 0.95], [0, 1, 1, 0]);
  const scaleX = useTransform(progress, [start, start + 0.18], [0.2, 1]);
  return (
    <motion.div className="rf-stat" style={{ opacity }}>
      <div className="rf-stat-bar" style={{ background: accent }}>
        <strong>{value}</strong>
      </div>
      <motion.span className="rf-stat-rule" style={{ background: accent, scaleX }} />
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

/* ------------------------------------------------------------------ */
/* Pillar timeline + scene                                             */
/* Sticky stepper across the top of the 5 engine sections. Empty circles*/
/* fill green with a bold black ring + line, in order, as you arrive.   */
/* ------------------------------------------------------------------ */

function TimelineNode({
  i,
  index,
  animate,
  progress
}: {
  i: number;
  index: number;
  animate: boolean;
  progress: MotionValue<number>;
}) {
  // fill: 1 when this node is reached, 0 otherwise.
  const driven = i === index && animate;
  const inA = driven ? 0.05 : 0;
  const inB = driven ? 0.24 : 0.0001;
  const v0 = i < index || (i === index && !animate) ? 1 : 0;
  const v1 = i <= index ? 1 : 0;
  const fill = useTransform(progress, [inA, inB], [v0, v1]);

  return (
    <div className="rf-tl-node">
      {i > 0 && (
        <>
          <span className="rf-tl-line-base" />
          <motion.span className="rf-tl-line" style={{ scaleX: fill }} />
        </>
      )}
      <div className="rf-tl-circle">
        <motion.span className="rf-tl-fill" style={{ opacity: fill, scale: fill }} />
      </div>
      <span className={`rf-tl-label ${i === index ? "is-active" : ""}`}>{PILLARS[i]}</span>
    </div>
  );
}

function PillarTimeline({ index, animate, progress }: { index: number; animate: boolean; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  return (
    <motion.div className="rf-timeline" style={{ opacity }} aria-hidden>
      {PILLARS.map((_, i) => (
        <TimelineNode animate={animate} i={i} index={index} key={i} progress={progress} />
      ))}
    </motion.div>
  );
}

/* The marketing engine as a living network that fluidly morphs into the
   top progress bar. Five large pillar nodes + supporting nodes, all wired
   together, drift up into an evenly spaced row as you scroll. */
function EngineNetwork({ progress }: { progress: MotionValue<number> }) {
  // 0 = full network, 1 = collapsed into the top bar.
  const morph = useTransform(progress, [0.42, 0.74], [0, 1]);

  const headOpacity = useTransform(progress, [0.02, 0.1, 0.7, 0.78], [0, 1, 1, 0]);
  const subOpacity = useTransform(progress, [0.12, 0.22, 0.42, 0.52], [0, 1, 1, 0]);
  const lineOpacity = useTransform(progress, [0.1, 0.2, 0.5, 0.64], [0, 0.5, 0.5, 0]);
  const captionOpacity = useTransform(progress, [0.78, 0.86, 0.95, 1], [0, 1, 1, 0]);

  // Per-node live centers (in 0..100 space) so the wiring follows the morph.
  const barY = 14;
  const nodeX = engineNodes.map((n, i) => useTransform(morph, (m) => lerp(n.net[0], 8 + i * 21, m)));
  const nodeY = engineNodes.map((n) => useTransform(morph, (m) => lerp(n.net[1], barY, m)));
  const nodeSize = engineNodes.map((n) => useTransform(morph, (m) => lerp(n.size, 30, m)));
  const nodeAppear = engineNodes.map((_, i) => useTransform(progress, [0.04 + i * 0.025, 0.16 + i * 0.025], [0, 1]));

  return (
    <div className="rf-net">
      <motion.div className="rf-net-head" style={{ opacity: headOpacity }}>
        <Kicker>The Marketing Engine</Kicker>
        <h2>One engine. Five ways in.</h2>
        <p>Events seed it. Green grass sells it. Ambassadors prove it. Content spreads it. Retail scales it.</p>
      </motion.div>

      <svg className="rf-net-wires" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* large-to-large links */}
        {engineLinks.map(([a, b], i) => (
          <motion.line
            key={`l${i}`}
            stroke="var(--rf-cream)"
            strokeWidth={0.18}
            style={{ opacity: lineOpacity }}
            x1={nodeX[a]}
            x2={nodeX[b]}
            y1={nodeY[a]}
            y2={nodeY[b]}
          />
        ))}
        {/* sub-to-parent links */}
        {subNodes.map((s, i) => (
          <motion.line
            key={`s${i}`}
            stroke="var(--rf-cream)"
            strokeWidth={0.14}
            style={{ opacity: subOpacity }}
            x1={s.net[0]}
            x2={nodeX[s.parent]}
            y1={s.net[1]}
            y2={nodeY[s.parent]}
          />
        ))}
      </svg>

      {/* supporting nodes */}
      {subNodes.map((s, i) => (
        <motion.div
          className="rf-net-sub"
          key={s.label}
          style={{
            left: `${s.net[0]}%`,
            top: `${s.net[1]}%`,
            width: s.size,
            height: s.size,
            opacity: subOpacity
          }}
        >
          <span>{s.label}</span>
        </motion.div>
      ))}

      {/* the five pillar nodes */}
      {engineNodes.map((n, i) => (
        <motion.div
          className="rf-net-node"
          key={n.label}
          style={{
            left: useTransform(nodeX[i], (v) => `${v}%`),
            top: useTransform(nodeY[i], (v) => `${v}%`),
            opacity: nodeAppear[i]
          }}
        >
          <motion.span className="rf-net-disc" style={{ width: nodeSize[i], height: nodeSize[i], background: n.accent }} />
          <span className="rf-net-label">{n.label}</span>
        </motion.div>
      ))}

      <motion.p className="rf-net-caption" style={{ opacity: captionOpacity }}>
        Scroll the five pillars below.
      </motion.p>
    </div>
  );
}

function PillarScene({
  id,
  className = "",
  index,
  animate = true,
  height = 2.6,
  children
}: {
  id?: string;
  className?: string;
  index: number;
  animate?: boolean;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
}) {
  return (
    <ScrollScene className={`rf-pillar ${className}`} height={height} id={id}>
      {(progress) => (
        <div className="rf-pillar-wrap">
          <PillarTimeline animate={animate} index={index} progress={progress} />
          <div className="rf-pillar-doc">{children(progress)}</div>
        </div>
      )}
    </ScrollScene>
  );
}

/* A standard pillar body: heading + staggered blocks. */
function PillarDoc({
  progress,
  kicker,
  heading,
  blocks
}: {
  progress: MotionValue<number>;
  kicker: React.ReactNode;
  heading: React.ReactNode;
  blocks: React.ReactNode[];
}) {
  return (
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
            <Reveal base={0.34} hold={0.85} index={2} progress={progress}>
              <p className="rf-hero-tag">Golf upgraded everything but the sock drawer. Del Campo makes the pair golf recognizes.</p>
            </Reveal>
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

      {/* 6 — The Marketing Engine (network morphs into the top bar) */}
      <ScrollScene className="rf-engine" height={3.6} id="engine-view">
        {(progress) => <EngineNetwork progress={progress} />}
      </ScrollScene>

      {/* 7 — Pillar 01: Events (falling socks → roadmap) */}
      <PillarScene className="rf-events" height={4.6} id="events" index={0}>
        {(progress) => (
          <div className="rf-doc rf-doc--fill">
            <Reveal className="rf-doc-head" hold={0.95} index={0} progress={progress}>
              <Kicker>01 · Events</Kicker>
              <h2>Events are the way in.</h2>
            </Reveal>
            <div className="rf-stage">
              <Beat progress={progress} win={[0.08, 0.16, 0.4, 0.48]}>
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
                  <p className="rf-lead">
                    Custom socks at premium events are the wedge — a bridge into the pro shop and a way to get great players into the brand. Tournaments and
                    corporate outings work the same way.
                  </p>
                </div>
              </Beat>
              <Beat progress={progress} win={[0.46, 0.54, 0.94, 0.99]}>
                <h3 className="rf-sub">The Play</h3>
                <Roadmap from={0.54} progress={progress} steps={memberGuestPlay} to={0.92} />
                <p className="rf-keyline">Custom club socks are not a product. They are a market-entry strategy.</p>
              </Beat>
            </div>
          </div>
        )}
      </PillarScene>

      {/* 8 — Pillar 02: Green Grass */}
      <PillarScene className="rf-greengrass" id="greengrass" index={1}>
        {(progress) => (
          <PillarDoc
            heading="The pro shop is the showroom."
            kicker="02 · Green Grass"
            progress={progress}
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
        )}
      </PillarScene>

      {/* 9 — Pillar 03a: Ambassadors / Caddies */}
      <PillarScene className="rf-ambassadors" id="ambassadors" index={2}>
        {(progress) => (
          <PillarDoc
            heading="Players wear pants. Caddies wear shorts."
            kicker="03 · Ambassadors"
            progress={progress}
            blocks={[
              <p className="rf-lead" key="a">The best sock visibility in golf may not be on the players at all. Caddies are on the bag, in shorts, in front of cameras every weekend.</p>,
              <p key="b">A few respected caddies in recognizable Del Campo socks on Sunday afternoon can create more brand memory than a wall of cheap influencer posts. Seed the loopers, then build “On the Bag” stories around them.</p>,
              <p className="rf-keyline" key="c">Caddies are not vanity influencers. They are culture carriers.</p>
            ]}
          />
        )}
      </PillarScene>

      {/* 9b — Pillar 03b: Ambassadors / College (same node) */}
      <PillarScene animate={false} className="rf-ambassadors" id="college" index={2}>
        {(progress) => (
          <PillarDoc
            heading="College rivalry golf keeps it young."
            kicker="03 · Ambassadors"
            progress={progress}
            blocks={[
              <p className="rf-lead" key="a">The same ambassador playbook runs on campus — young and tasteful, not a circus.</p>,
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
        )}
      </PillarScene>

      {/* 10 — Pillar 04: Content */}
      <PillarScene className="rf-content" height={2.8} id="content" index={3}>
        {(progress) => (
          <PillarDoc
            heading="A classy golf channel, not a bro content house."
            kicker="04 · Content"
            progress={progress}
            blocks={[
              <p key="a">Del Campo does not need to become Good Good. The opportunity is a premium, editorial, golf-native layer — one host, one point of view, repeatable formats — that makes Del Campo present inside the culture without cheapening it.</p>,
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
        )}
      </PillarScene>

      {/* 11 — Pillar 05: Retail */}
      <PillarScene className="rf-retail" id="retail" index={4}>
        {(progress) => (
          <PillarDoc
            heading="Retail scales what the engine builds."
            kicker="05 · Retail"
            progress={progress}
            blocks={[
              <p key="a">DTC demand, wholesale, big-box distribution, and the PGA TOUR Fan Shop turn brand heat into volume. Events, shops, ambassadors, and content all drive people back to where they can actually buy.</p>,
              <div className="rf-checklist" key="b">
                {retailList.map((item) => (
                  <span className="rf-check" key={item}>
                    {item}
                  </span>
                ))}
              </div>,
              <p className="rf-keyline" key="c">Presence creates demand. Retail captures it.</p>
            ]}
          />
        )}
      </PillarScene>

      {/* 12 — Brand Memory (coda to the engine) */}
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

      {/* 13 — The Growth Flywheel */}
      <ScrollScene className="rf-flywheel" height={4} id="flywheel">
        {(progress) => <GrowthFlywheel progress={progress} />}
      </ScrollScene>

      {/* 14 — The First Strategic Plays */}
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

      {/* 15 — The Operating System */}
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

      {/* 16 — Closing */}
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
