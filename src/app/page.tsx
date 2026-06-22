"use client";

import { useEffect, useRef, useState } from "react";
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

/* The lime hub the whole engine hangs off of. */
const HUB = { net: [50, 64], size: 64 };

/* Five pillar nodes, clustered + jumbled in a compact band below the
   heading, that collapse into evenly spaced top-bar slots (10..90%). */
const engineNodes = [
  { label: "Events", net: [33, 56], size: 38 },
  { label: "Green Grass", net: [43, 76], size: 34 },
  { label: "Ambassadors", net: [51, 50], size: 40 },
  { label: "Media", net: [61, 74], size: 34 },
  { label: "Retail", net: [68, 58], size: 36 }
];

/* Small supporting nodes clustered around their pillar; fade on collapse. */
const subNodes = [
  { label: "Member-guests", parent: 0, net: [25, 47], size: 18 },
  { label: "Tournaments", parent: 0, net: [26, 64], size: 22 },
  { label: "Pro shops", parent: 1, net: [37, 85], size: 16 },
  { label: "Reorders", parent: 1, net: [49, 84], size: 20 },
  { label: "Caddies", parent: 2, net: [45, 42], size: 16 },
  { label: "College", parent: 2, net: [57, 43], size: 20 },
  { label: "Course stories", parent: 3, net: [57, 85], size: 18 },
  { label: "Creators", parent: 3, net: [70, 82], size: 16 },
  { label: "DTC", parent: 4, net: [76, 51], size: 20 },
  { label: "Wholesale", parent: 4, net: [75, 68], size: 16 }
];

/* The chain that becomes the timeline rail (stays through the morph). */
const railLinks = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4]
];

/* Extra cross-links for a jumbled web; fade out on collapse. */
const meshLinks = [
  [0, 2],
  [2, 4],
  [1, 3]
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

/* Media channel content formats */
const mediaFormats = [
  ["On the Bag", "Caddies in shorts, socks visible, tournament-week stories from inside the ropes."],
  ["Course Stories", "Editorial features on clubs, resort courses, munis, and the people who love them."],
  ["College Rivalry Golf", "High-energy matches, alumni weekends, campus-color drops."],
  ["Golf X · Organic Social", "Anonymous golf fashion accounts post players' tournament fits to serious golfers. When they post Del Campo, that's earned discovery money can't buy."]
];

/* Creator co-brand and commerce formats */
const commerceFormats = [
  ["Creator Co-Branded Drops", "Bob Does Sports, Fore Play, Grant Horvat — their logo, their audience, sold on their own merch store."],
  ["The Content-to-Commerce Loop", "Caddie loops for camera. Video launches the co-branded drop. Drop drives sales. Content becomes proof you reuse everywhere."],
  ["Inside the Member-Guest", "The event, the tee gift, the custom sock, the follow-up reorder."],
  ["Pro Shop Placement", "Custom displays, head-pro relationships, and club-specific sections."]
];

/* Proof already in the wild — plus the organic signal worth naming. */
const proofPoints = [
  ["Jason Kelce", "Wore Del Campo at a PGA TOUR Pro-Am — unprompted and unpaid."],
  ["Patrick Koenig", "\"My favorite golf socks I’ve ever worn\" — and his 100-hole-hike pick."],
  ["Horschel Family Foundation", "A collaboration sock already in the lineup."],
  ["Caddie Chronicles", "Real PGA TOUR caddie voices, already on record and building the foundation."],
  ["Anonymous X / Twitter", "Golf fashion accounts posting players’ fits at the US Open. Organic discovery — the right audience, the right moment, for free."]
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
/* The persistent rail                                                 */
/* One element. It assembles as a web below the engine heading, morphs */
/* up into the timeline bar, then STAYS pinned at the top — lighting    */
/* lime as you move through the five pillars below it.                 */
/* ------------------------------------------------------------------ */

function EngineHeading({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.36, 0.48], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.02, 0.12], [0.95, 1]);
  return (
    <motion.div className="rf-engine-text" style={{ opacity, scale }}>
      <Kicker>The Marketing Engine</Kicker>
      <h2>One engine. Five ways in.</h2>
      <p>Events seed it. Green grass stocks it. Ambassadors prove it. Media spreads it. Retail scales it.</p>
    </motion.div>
  );
}

function JourneyRail({
  engineRef,
  tailRef,
  active
}: {
  engineRef: React.RefObject<HTMLElement | null>;
  tailRef: React.RefObject<HTMLElement | null>;
  active: number;
}) {
  const { scrollYProgress: eP } = useScroll({ target: engineRef, offset: ["start start", "end end"] });
  // A small sentinel at the very end of the journey drives the fade-out.
  const { scrollYProgress: tailP } = useScroll({ target: tailRef, offset: ["start end", "start center"] });

  // 0 = full web, 1 = collapsed timeline bar. Holds at 1 once past the engine.
  const morph = useTransform(eP, [0.5, 0.9], [0, 1]);

  // Fade the whole rail in as the engine starts, out only as the journey ends.
  const fadeIn = useTransform(eP, [0, 0.04], [0, 1]);
  const fadeOut = useTransform(tailP, [0.2, 0.7], [1, 0]);
  const railShow = useTransform([fadeIn, fadeOut] as MotionValue[], ([a, b]: number[]) => Math.min(a, b));

  const hubOpacity = useTransform(eP, [0.04, 0.14, 0.44, 0.56], [0, 1, 1, 0]);
  const subOpacity = useTransform(eP, [0.06, 0.18, 0.42, 0.54], [0, 1, 1, 0]);
  const meshOpacity = useTransform(eP, [0.06, 0.18, 0.42, 0.54], [0, 0.4, 0.4, 0]);
  const railLineOpacity = useTransform(eP, [0.08, 0.2], [0, 1]);

  // Track viewport width so the collapsed bar can land on the content column
  // (1000px, centered) in real pixels — full-width web, content-aligned bar.
  const [vw, setVw] = useState(1440);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const COLUMN = 1000;
  // bar slot for node i as a viewport % (50% +/- pixels of the content column)
  const barX = engineNodes.map((_, i) => 50 + (((i - 2) * (COLUMN / 4)) / vw) * 100);

  const barY = 9;
  const nodeX = engineNodes.map((n, i) => useTransform(morph, (m) => lerp(n.net[0], barX[i], m)));
  const nodeY = engineNodes.map((n) => useTransform(morph, (m) => lerp(n.net[1], barY, m)));
  const nodeSizes = engineNodes.map((n) => useTransform(morph, (m) => lerp(n.size, 26, m)));
  const hubX = useTransform(morph, (m) => lerp(HUB.net[0], 50, m));
  const hubY = useTransform(morph, (m) => lerp(HUB.net[1], barY, m));

  return (
    <motion.div className="rf-rail" aria-hidden style={{ opacity: railShow }}>
      <div className="rf-rail-stage">
        <svg className="rf-net-wires" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* hub spokes — fade out */}
          {engineNodes.map((_, i) => (
            <motion.line
              key={`h${i}`}
              stroke="var(--rf-neon)"
              strokeWidth={0.14}
              style={{ opacity: hubOpacity }}
              x1={hubX}
              x2={nodeX[i]}
              y1={hubY}
              y2={nodeY[i]}
            />
          ))}
          {/* mesh cross-links — fade out */}
          {meshLinks.map(([a, b], i) => (
            <motion.line
              key={`m${i}`}
              stroke="var(--rf-line)"
              strokeWidth={0.12}
              style={{ opacity: meshOpacity }}
              x1={nodeX[a]}
              x2={nodeX[b]}
              y1={nodeY[a]}
              y2={nodeY[b]}
            />
          ))}
          {/* sub-to-parent links — fade out */}
          {subNodes.map((s, i) => (
            <motion.line
              key={`s${i}`}
              stroke="var(--rf-line)"
              strokeWidth={0.1}
              style={{ opacity: subOpacity }}
              x1={s.net[0]}
              x2={nodeX[s.parent]}
              y1={s.net[1]}
              y2={nodeY[s.parent]}
            />
          ))}
          {/* rail chain — base connector, stays */}
          {railLinks.map(([a, b], i) => (
            <motion.line
              key={`r${i}`}
              stroke="var(--rf-line)"
              strokeWidth={0.18}
              style={{ opacity: railLineOpacity }}
              x1={nodeX[a]}
              x2={nodeX[b]}
              y1={nodeY[a]}
              y2={nodeY[b]}
            />
          ))}
          {/* rail chain — bold black as each segment is reached */}
          {railLinks.map(([a, b], i) => (
            <motion.line
              className={`rf-wire-live ${active >= b ? "is-on" : ""}`}
              key={`rl${i}`}
              stroke="var(--rf-cream)"
              strokeWidth={0.5}
              x1={nodeX[a]}
              x2={nodeX[b]}
              y1={nodeY[a]}
              y2={nodeY[b]}
            />
          ))}
        </svg>

        {/* supporting nodes with labels */}
        {subNodes.map((s, i) => (
          <motion.div
            className="rf-subnode"
            key={`sub${i}`}
            style={{ left: `${s.net[0]}%`, top: `${s.net[1]}%`, opacity: subOpacity }}
          >
            <span className="rf-net-dot" style={{ width: s.size, height: s.size }} />
            <span className="rf-subnode-label">{s.label}</span>
          </motion.div>
        ))}

        {/* the lime hub */}
        <motion.div
          className="rf-hub"
          style={{ left: useTransform(hubX, (v) => `${v}%`), top: useTransform(hubY, (v) => `${v}%`), opacity: hubOpacity }}
        >
          <span className="rf-hub-disc" style={{ width: HUB.size, height: HUB.size }} />
          <span className="rf-hub-label">Marketing Engine</span>
        </motion.div>

        {/* the five pillar nodes -> timeline */}
        {engineNodes.map((n, i) => {
          const filled = active >= 0 && i <= active;
          return (
            <motion.div
              className="rf-rail-node"
              key={n.label}
              style={{ left: useTransform(nodeX[i], (v) => `${v}%`), top: useTransform(nodeY[i], (v) => `${v}%`) }}
            >
              <motion.span className={`rf-rail-disc ${filled ? "is-on" : ""}`} style={{ width: nodeSizes[i], height: nodeSizes[i] }}>
                <span className={`rf-rail-fill ${filled ? "is-on" : ""}`} />
              </motion.span>
              <span className={`rf-rail-label ${active === i ? "is-active" : ""}`}>{n.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* A pillar scene reports itself as the active node while it is centered,
   so the persistent rail above lights the right circle. */
function PillarBody({
  progress,
  node,
  onActive,
  children
}: {
  progress: MotionValue<number>;
  node: number;
  onActive: (n: number) => void;
  children: React.ReactNode;
}) {
  useMotionValueEvent(progress, "change", (p) => {
    if (p > 0.08 && p < 0.94) onActive(node);
  });
  return (
    <div className="rf-pillar-wrap">
      <div className="rf-pillar-doc">{children}</div>
    </div>
  );
}

function PillarScene({
  id,
  className = "",
  node,
  onActive,
  height = 2.6,
  children
}: {
  id?: string;
  className?: string;
  node: number;
  onActive: (n: number) => void;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
}) {
  return (
    <ScrollScene className={`rf-pillar ${className}`} height={height} id={id}>
      {(progress) => (
        <PillarBody node={node} onActive={onActive} progress={progress}>
          {children(progress)}
        </PillarBody>
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const engineRef = useRef<HTMLElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(-1);
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
          <p className="rf-keyline" key="c">That gap is the opening — and Del Campo already moved into it.</p>,
          <p key="d">
            This isn&apos;t a 0-to-1 idea. Golfers already wear socks, and Del Campo is already in the drawer. The job is not to invent a behavior. It is to
            organize what&apos;s already working into one engine.
          </p>
        ]}
      />

      {/* 4 — Proof */}
      <DocScene
        height={1.9}
        id="proof"
        kicker="Proof"
        heading="The proof is already in the wild."
        blocks={[
          <p className="rf-lead" key="a">Jason Kelce wore Del Campo at a Pro-Am. Patrick Koenig called them his all-time favorite pair. An anonymous golf fashion account on X posted a player wearing Del Campo at the US Open — and the brand got discovered organically, by exactly the right audience, for nothing.</p>,
          <p key="b">That kind of proof doesn&apos;t come from campaigns. It comes from being the sock serious golfers actually reach for. The job now is to build more of it deliberately — and collect every moment into something reusable: ad creative, sell sheets, pro-shop pitches, event decks.</p>,
          <div className="rf-modules" key="c">
            {proofPoints.map(([title, body]) => (
              <div className="rf-module" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>,
          <p className="rf-keyline" key="d">Proof compounds. Every pair in the right room is one more moment waiting to be captured.</p>
        ]}
      />

      {/* 5 — The Position (fashion + performance wedge) */}
      <DocScene
        height={1.9}
        id="position"
        kicker="The Position"
        heading="The performance sock golfers actually want to show."
        blocks={[
          <p key="a">
            Del Campo shouldn&apos;t fight FootJoy, Swiftwick, or Bombas on raw performance — and it shouldn&apos;t become a novelty sock. The open lane is the
            gap between them: golf-native fashion with real performance underneath.
          </p>,
          <p key="b">
            The performance is already there to earn a serious golfer&apos;s trust: cushioned heel and toe, arch support that holds through 18, an above-ankle
            cut that keeps debris out, moisture-wicking, Made in America.
          </p>,
          <p className="rf-keyline" key="c">Performance gets them through 18. Style gets them noticed. Custom identity gets them remembered.</p>
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

      {/* 6 — The journey: engine network morphs into a persistent rail that
          stays pinned at the top through all five pillars */}
      <div className="rf-journey">
        <JourneyRail active={active} engineRef={engineRef} tailRef={tailRef} />

        {/* The Marketing Engine heading; the web assembles below it */}
        <section className="rf-scene rf-engine-track" id="engine-view" ref={engineRef} style={{ minHeight: "340vh" }}>
          <div className="rf-sticky">
            <EngineHeading targetRef={engineRef} />
          </div>
        </section>

      {/* 7 — Pillar 01: Events (falling socks → roadmap) */}
      <PillarScene className="rf-events" height={4.6} id="events" node={0} onActive={setActive}>
        {(progress) => (
          <div className="rf-doc rf-doc--fill">
            <Reveal className="rf-doc-head" hold={0.95} index={0} progress={progress}>
              <Kicker>01 · Events</Kicker>
              <h2>Events are the way in.</h2>
            </Reveal>
            <div className="rf-stage">
              <Beat progress={progress} win={[0.08, 0.16, 0.4, 0.48]}>
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
              </Beat>
            </div>
          </div>
        )}
      </PillarScene>

      {/* 8 — Pillar 02: Green Grass */}
      <PillarScene className="rf-greengrass" id="greengrass" node={1} onActive={setActive}>
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
      <PillarScene className="rf-ambassadors" id="ambassadors" node={2} onActive={setActive}>
        {(progress) => (
          <div className="rf-doc rf-doc--side">
            <div className="rf-side-main">
              <Reveal className="rf-doc-head" index={0} progress={progress}>
                <Kicker>03 · Ambassadors</Kicker>
                <h2>Players wear pants. Caddies wear shorts.</h2>
              </Reveal>
              <Reveal className="rf-doc-block" index={1} progress={progress}>
                <p className="rf-lead">The best sock visibility in golf may not be on the players at all. Caddies are on the bag, in shorts, in front of cameras every weekend.</p>
              </Reveal>
              <Reveal className="rf-doc-block" index={2} progress={progress}>
                <p>A few respected caddies in recognizable Del Campo socks on Sunday afternoon can create more brand memory than a wall of cheap influencer posts. Seed the loopers, then build &ldquo;On the Bag&rdquo; stories around them.</p>
              </Reveal>
              <Reveal className="rf-doc-block" index={3} progress={progress}>
                <p className="rf-keyline">Caddies are not vanity influencers. They are culture carriers.</p>
              </Reveal>
            </div>
            <Reveal className="rf-side-aside" index={1} progress={progress}>
              <figure className="rf-quote-card">
                <blockquote>
                  &ldquo;Our members make their living on their feet — so foot care is critical. Our guys don&apos;t think of socks as just a fashion item — they need real gear that performs and keeps them going.&rdquo;
                </blockquote>
                <figcaption>
                  <strong>James Edmonson</strong>
                  <span>Longtime PGA Tour Caddie · President, Association of Professional Tour Caddies (APTC)</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        )}
      </PillarScene>

      {/* 9b — Pillar 03b: Ambassadors / College (same node) */}
      <PillarScene className="rf-ambassadors" id="college" node={2} onActive={setActive}>
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

      {/* 10a — Pillar 04: Media */}
      <PillarScene className="rf-content" id="content" node={3} onActive={setActive}>
        {(progress) => (
          <PillarDoc
            heading="Golf media is where the culture lives."
            kicker="04 · Media"
            progress={progress}
            blocks={[
              <p className="rf-lead" key="a">YouTube golf is now a massive culture channel — Good Good, Bob Does Sports, Fore Play, Grant Horvat. Del Campo&apos;s own presence looks underdeveloped next to the size of it.</p>,
              <p key="b">The move isn&apos;t to become Good Good. It&apos;s &ldquo;On the Bag&rdquo; — tasteful caddie content built from the Caddie Chronicles foundation that already exists. Golf-native, not a circus.</p>,
              <p key="c">On X, anonymous golf fashion accounts post players&apos; tournament fits to audiences of serious golfers. When one of those posts features Del Campo, that&apos;s earned discovery at exactly the right moment — for nothing.</p>,
              <div className="rf-formats" key="d">
                {mediaFormats.map(([title, body]) => (
                  <div className="rf-format" key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>,
              <p className="rf-keyline" key="e">The mechanic is Good Good. The tone is &ldquo;I know what those are&rdquo; — never &ldquo;what is he wearing?&rdquo;</p>
            ]}
          />
        )}
      </PillarScene>

      {/* 10b — Pillar 04: Commerce */}
      <PillarScene className="rf-content" id="commerce" node={3} onActive={setActive}>
        {(progress) => (
          <PillarDoc
            heading="Creators aren't ambassadors. They're distribution."
            kicker="04 · Commerce"
            progress={progress}
            blocks={[
              <p className="rf-lead" key="a">Co-branded Del Campo socks — their logo, their audience, sold on their own merch store. The creator gets a product. Del Campo gets the placement.</p>,
              <p key="b">A caddie loops for the group on camera. The video launches the co-branded drop. The drop drives sales. The content becomes proof Del Campo reuses in ads and pro-shop materials. That&apos;s the Malbon lesson — told with restraint instead of shock value.</p>,
              <div className="rf-formats" key="c">
                {commerceFormats.map(([title, body]) => (
                  <div className="rf-format" key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>,
              <p className="rf-keyline" key="d">Content drives commerce. Commerce proves content is worth making.</p>
            ]}
          />
        )}
      </PillarScene>

      {/* 11 — Pillar 05: Retail */}
      <PillarScene className="rf-retail" id="retail" node={4} onActive={setActive}>
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
        <div className="rf-journey-tail" ref={tailRef} aria-hidden />
      </div>

      {/* 12 — The Compound (synthesis of the engine) */}
      <DocScene
        id="memory"
        kicker="The Compound"
        heading="Five channels. One brand that's impossible to miss."
        blocks={[
          <p className="rf-lead" key="a">Events plant the sock in the right rooms. Green grass stocks it in every pro shop. Caddies make it credible on Sunday afternoon. Media spreads the proof. Retail captures the demand each channel creates.</p>,
          <p key="b">None of these moves is expensive in isolation. Together, they make Del Campo the sock that appears everywhere golf culture lives — and that&apos;s when the brand becomes self-reinforcing.</p>,
          <div key="c">
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

      {/* 13 — Closing */}
      <ScrollScene className="rf-final" height={1.9}>
        {(progress) => (
          <div className="rf-doc">
            <Reveal className="rf-doc-head" index={0} progress={progress}>
              <Kicker>The Where</Kicker>
              <h2>From Del Campo — to the sock golf recognizes.</h2>
            </Reveal>
            <Lines
              base={0.22}
              items={[
                "Not louder. More present.",
                "Present at the member-guest. On the caddie's bag Sunday. In the pro shop. In the college rivalry. In the limited drop that sells out.",
                "Del Campo already has the product. The system is what compounds it."
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
