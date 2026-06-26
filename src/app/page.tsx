"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
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
/* Burst statement slides — a pinpoint circle in the center grows on    */
/* scroll until it floods the screen with color; the heading then slams  */
/* in from the sides with a smaller line beneath. On the way out it      */
/* runs in reverse: text retreats, circle collapses back to a point.     */
/* Used for the hero and every transition moment.                        */
/* ------------------------------------------------------------------ */

type BurstLineData = { text: string; accent?: boolean };

function BurstStatement({
  id,
  theme = "black",
  kicker,
  heading,
  sub,
  height = 2.6,
  startRadius = 0,
  collapseTo = 0,
  scrollHint = false
}: {
  id?: string;
  theme?: "black" | "green" | "lime";
  kicker?: React.ReactNode;
  heading: BurstLineData[];
  sub?: React.ReactNode;
  height?: number;
  startRadius?: number;
  collapseTo?: number;
  scrollHint?: boolean;
}) {
  return (
    <ScrollScene className={`rf-burst rf-burst--${theme}`} height={height} id={id}>
      {(progress) => (
        <BurstBody
          collapseTo={collapseTo}
          heading={heading}
          kicker={kicker}
          progress={progress}
          scrollHint={scrollHint}
          startRadius={startRadius}
          sub={sub}
        />
      )}
    </ScrollScene>
  );
}

function BurstBody({
  progress,
  kicker,
  heading,
  sub,
  startRadius = 0,
  collapseTo = 0,
  scrollHint = false
}: {
  progress: MotionValue<number>;
  kicker?: React.ReactNode;
  heading: BurstLineData[];
  sub?: React.ReactNode;
  startRadius?: number;
  collapseTo?: number;
  scrollHint?: boolean;
}) {
  // The iris is a circular clip-path aperture, not a scaled object: it can start
  // as a small disc (startRadius) or a point, blooms to 75% (clears the viewport
  // corners), HOLDS open across the content window, then collapses — either back
  // to a point or down to a small disc (collapseTo) for a hand-off to the next
  // section. A spring gives it weight.
  const rawClip = useTransform(progress, [0, 0.3, 0.74, 0.93], [startRadius, 75, 75, collapseTo]);
  const clipR = useSpring(rawClip, { stiffness: 80, damping: 26 });
  const clip = useMotionTemplate`circle(${clipR}% at 50% 50%)`;
  // The "scroll" hint sits on the small starting disc and clears fast as it blooms.
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <>
      <motion.div aria-hidden className="rf-burst-iris" style={{ clipPath: clip, WebkitClipPath: clip }} />
      {scrollHint ? (
        <motion.span aria-hidden className="rf-burst-hint" style={{ opacity: hintOpacity }}>
          Scroll
        </motion.span>
      ) : null}
      <div className="rf-burst-content">
        {kicker ? (
          <BurstFade from={0.32} progress={progress}>
            <span className="rf-burst-kicker">{kicker}</span>
          </BurstFade>
        ) : null}
        <div className="rf-burst-heading">
          {heading.map((line, i) => (
            <BurstLine index={i} key={i} line={line} progress={progress} />
          ))}
        </div>
        {sub ? (
          <BurstFade from={0.46} progress={progress}>
            <p className="rf-burst-sub">{sub}</p>
          </BurstFade>
        ) : null}
      </div>
    </>
  );
}

/* A heading line: enters from its side once the screen is flooded, then
   retreats to the same side on the way out (the inverse of its entry). */
function BurstLine({ line, index, progress }: { line: BurstLineData; index: number; progress: MotionValue<number> }) {
  const from = index % 2 === 0 ? -460 : 460;
  const inStart = 0.32 + index * 0.05;
  const x = useTransform(progress, [inStart, inStart + 0.12, 0.64, 0.74], [from, 0, 0, from]);
  const opacity = useTransform(progress, [inStart, inStart + 0.09, 0.62, 0.72], [0, 1, 1, 0]);
  return (
    <motion.span className={`rf-burst-line ${line.accent ? "is-accent" : ""}`} style={{ x, opacity }}>
      {line.text}
    </motion.span>
  );
}

/* Kicker / sub-copy: a gentle rise + fade, timed inside the flood. */
function BurstFade({ progress, from, children }: { progress: MotionValue<number>; from: number; children: React.ReactNode }) {
  const opacity = useTransform(progress, [from, from + 0.08, 0.62, 0.72], [0, 1, 1, 0]);
  const y = useTransform(progress, [from, from + 0.08], [26, 0]);
  return (
    <motion.div className="rf-burst-fade" style={{ opacity, y }}>
      {children}
    </motion.div>
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

/* The lime hub sits dead center; everything springs out from it. */
const HUB = { net: [50, 50], size: 64 };

/* Five pillar nodes, ringed around the centered hub (x roughly increasing so
   the later collapse into the left-to-right timeline bar reads cleanly). */
const engineNodes = [
  { label: "Events", net: [22, 42], size: 38 },
  { label: "Green Grass", net: [34, 72], size: 34 },
  { label: "Ambassadors", net: [50, 24], size: 40 },
  { label: "Media", net: [66, 70], size: 34 },
  { label: "Retail", net: [78, 44], size: 36 }
];

/* Two satellites per pillar, in an outer ring beyond their parent node. */
const subNodes = [
  { label: "Member-guests", parent: 0, net: [10, 30], size: 18 },
  { label: "Tournaments", parent: 0, net: [12, 54], size: 22 },
  { label: "Pro shops", parent: 1, net: [20, 84], size: 16 },
  { label: "Reorders", parent: 1, net: [40, 86], size: 20 },
  { label: "Caddies", parent: 2, net: [42, 11], size: 16 },
  { label: "College", parent: 2, net: [60, 11], size: 20 },
  { label: "Course stories", parent: 3, net: [64, 86], size: 18 },
  { label: "Creators", parent: 3, net: [82, 82], size: 16 },
  { label: "DTC", parent: 4, net: [90, 31], size: 20 },
  { label: "Wholesale", parent: 4, net: [92, 54], size: 16 }
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
  // The hub (the lime dot the Chapter 04 circle became) reads alone for a beat,
  // then the heading rises over it, then clears before the nodes fire (~0.2).
  const opacity = useTransform(scrollYProgress, [0.04, 0.08, 0.16, 0.2], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.04, 0.08], [0.96, 1]);
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

  // Choreographed build along the engine scroll:
  //   ~0.00–0.04  the centered hub is the lime dot the Chapter 04 circle became
  //   ~0.04–0.20  the heading reads, then clears
  //   ~0.20–0.45  the five pillar nodes fire out of the hub, one at a time
  //   ~0.46–0.65  each node's two satellites fire out, one at a time
  //   ~0.62–0.70  the labels (all the words) fade up
  //   ~0.76–0.94  the whole web collapses up into the timeline bar
  const morph = useTransform(eP, [0.76, 0.94], [0, 1]);

  // Fade the whole rail in as the engine starts, out only at the very end of
  // the journey (kept late so the five labels persist through every pillar).
  const fadeIn = useTransform(eP, [0, 0.02], [0, 1]);
  const fadeOut = useTransform(tailP, [0.45, 0.85], [1, 0]);
  const railShow = useTransform([fadeIn, fadeOut] as MotionValue[], ([a, b]: number[]) => Math.min(a, b));

  // Web ornamentation (hub, spokes, mesh, satellites) fades as the bar forms.
  const webFade = useTransform(eP, [0.74, 0.84], [1, 0]);
  const hubIn = useTransform(eP, [0, 0.03], [0, 1]);
  const hubOpacity = useTransform([hubIn, webFade] as MotionValue[], ([a, b]: number[]) => Math.min(a, b));
  const meshOpacity = useTransform(eP, [0.4, 0.5, 0.74, 0.82], [0, 0.32, 0.32, 0]);
  const railLineOpacity = useTransform(eP, [0.62, 0.72], [0, 1]);

  // Per-node emergence (staggered) — the "one at a time" firing.
  const mainEmerge = engineNodes.map((_, i) => {
    const s = 0.2 + i * 0.045;
    return useTransform(eP, [s, s + 0.07], [0, 1]);
  });
  const subEmerge = subNodes.map((_, i) => {
    const s = 0.46 + i * 0.015;
    return useTransform(eP, [s, s + 0.05], [0, 1]);
  });
  // Dots appear as they fire and stay solid; satellites/spokes fade on collapse.
  const nodeOpacity = mainEmerge.map((e) => useTransform(e, [0, 0.25], [0, 1]));
  const spokeOpacity = mainEmerge.map((e) => useTransform([e, webFade] as MotionValue[], ([a, b]: number[]) => Math.min(a, b)));
  const subDotOpacity = subEmerge.map((e) => useTransform([e, webFade] as MotionValue[], ([a, b]: number[]) => Math.min(a, b)));

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
  // Each node: hub center -> net position (its own emerge) -> bar slot (morph).
  const nodeX = engineNodes.map((n, i) =>
    useTransform([mainEmerge[i], morph] as MotionValue[], ([e, m]: number[]) => lerp(lerp(HUB.net[0], n.net[0], e), barX[i], m))
  );
  const nodeY = engineNodes.map((n, i) =>
    useTransform([mainEmerge[i], morph] as MotionValue[], ([e, m]: number[]) => lerp(lerp(HUB.net[1], n.net[1], e), barY, m))
  );
  const nodeSizes = engineNodes.map((n) => useTransform(morph, (m) => lerp(n.size, 26, m)));
  // Satellites fly out from their PARENT node to their net spot, then fade.
  const subX = subNodes.map((s, i) => useTransform(subEmerge[i], (e) => lerp(engineNodes[s.parent].net[0], s.net[0], e)));
  const subY = subNodes.map((s, i) => useTransform(subEmerge[i], (e) => lerp(engineNodes[s.parent].net[1], s.net[1], e)));
  const hubX = useTransform(morph, () => 50);
  const hubY = useTransform(morph, (m) => lerp(HUB.net[1], barY, m));

  return (
    <motion.div className="rf-rail" aria-hidden style={{ opacity: railShow }}>
      <div className="rf-rail-stage">
        <svg className="rf-net-wires" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* hub spokes — draw out as each node fires, then fade */}
          {engineNodes.map((_, i) => (
            <motion.line
              key={`h${i}`}
              stroke="var(--rf-neon)"
              strokeWidth={0.14}
              style={{ opacity: spokeOpacity[i] }}
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
          {/* sub-to-parent links — fly out with each satellite, then fade */}
          {subNodes.map((s, i) => (
            <motion.line
              key={`s${i}`}
              stroke="var(--rf-line)"
              strokeWidth={0.1}
              style={{ opacity: subDotOpacity[i] }}
              x1={subX[i]}
              x2={nodeX[s.parent]}
              y1={subY[i]}
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

        {/* supporting nodes — dots fire out first, labels fade up after */}
        {subNodes.map((s, i) => (
          <motion.div
            className="rf-subnode"
            key={`sub${i}`}
            style={{
              left: useTransform(subX[i], (v) => `${v}%`),
              top: useTransform(subY[i], (v) => `${v}%`),
              opacity: subDotOpacity[i]
            }}
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
              style={{
                left: useTransform(nodeX[i], (v) => `${v}%`),
                top: useTransform(nodeY[i], (v) => `${v}%`),
                opacity: nodeOpacity[i]
              }}
            >
              <motion.span className={`rf-rail-disc ${filled ? "is-on" : ""}`} style={{ width: nodeSizes[i], height: nodeSizes[i] }}>
                <span className={`rf-rail-fill ${filled ? "is-on" : ""}`} />
              </motion.span>
              <motion.span className={`rf-rail-label ${active === i ? "is-active" : ""}`} style={{ opacity: nodeOpacity[i] }}>
                {n.label}
              </motion.span>
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

      {/* 1 — Hero — opens on a small black disc with a "scroll" cue */}
      <BurstStatement
        height={2.1}
        heading={[{ text: "Own the" }, { text: "Sock Drawer.", accent: true }]}
        id="top"
        kicker="Born on a Florida muni · Made in the USA"
        scrollHint
        startRadius={7}
        sub="Golf upgraded everything but the sock drawer. Del Campo makes the pair golf recognizes."
        theme="black"
      />

      {/* Chapter 01 — The Opportunity */}
      <BurstStatement
        height={2}
        heading={[{ text: "Golf grew up." }, { text: "The sock didn't.", accent: true }]}
        kicker="Chapter 01 · The Opportunity"
        sub="Clubs, shoes, polos, belts — every piece of golf leveled up. The sock drawer is the last open lane."
        theme="green"
      />

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

      {/* Chapter 02 — The Proof */}
      <BurstStatement
        height={2}
        heading={[{ text: "It's already" }, { text: "in the wild.", accent: true }]}
        kicker="Chapter 02 · The Proof"
        sub="Pros wear it unprompted. Caddies vouch for it. Golf accounts post it. The credibility exists — it just isn't collected yet."
        theme="black"
      />

      {/* 4 — Proof, part 1: the story */}
      <DocScene
        height={1.9}
        id="proof"
        kicker="Proof"
        heading="Credibility nobody had to buy."
        blocks={[
          <p className="rf-lead" key="a">Jason Kelce wore Del Campo at a Pro-Am. Patrick Koenig called them his all-time favorite pair. An anonymous golf fashion account on X posted a player wearing Del Campo at the US Open — and the brand got discovered organically, by exactly the right audience, for nothing.</p>,
          <p key="b">That kind of proof doesn&apos;t come from campaigns. It comes from being the sock serious golfers actually reach for.</p>,
          <p className="rf-keyline" key="c">The job now isn&apos;t to manufacture credibility. It&apos;s to capture the credibility that already exists.</p>
        ]}
      />

      {/* 4b — Proof, part 2: the library */}
      <DocScene
        height={1.9}
        id="proof-library"
        kicker="The Proof Library"
        heading="Turn scattered moments into reusable proof."
        blocks={[
          <p key="a">Every endorsement, every organic post, every caddie voice becomes an asset Del Campo can reuse in ad creative, sell sheets, pro-shop pitches, and event decks.</p>,
          <div className="rf-modules" key="b">
            {proofPoints.map(([title, body]) => (
              <div className="rf-module" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>,
          <p className="rf-keyline" key="c">Proof compounds. Every pair in the right room is one more moment waiting to be captured.</p>
        ]}
      />

      {/* Chapter 03 — The Position */}
      <BurstStatement
        height={2}
        heading={[{ text: "Socks" }, { text: "are next.", accent: true }]}
        kicker="Chapter 03 · The Position"
        sub="What needlepoint belts did for golf accessories, Del Campo can do for the sock — performance underneath, fashion on top."
        theme="green"
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

      {/* Chapter 04 — The Engine. Lime, and its circle collapses down to a
          hub-sized disc so it reads as the Marketing Engine nucleus on the
          next section. */}
      <BurstStatement
        collapseTo={2.4}
        heading={[{ text: "Five ways" }, { text: "into golf.", accent: true }]}
        height={2.1}
        kicker="Chapter 04 · The Engine"
        sub="Events, green grass, ambassadors, media, retail. One engine that compounds — not five campaigns that don't."
        theme="lime"
      />

      {/* 6 — The journey: engine network morphs into a persistent rail that
          stays pinned at the top through all five pillars */}
      <div className="rf-journey">
        <JourneyRail active={active} engineRef={engineRef} tailRef={tailRef} />

        {/* The Marketing Engine heading; the web assembles below it */}
        <section className="rf-scene rf-engine-track" id="engine-view" ref={engineRef} style={{ minHeight: "480vh" }}>
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
                <p className="rf-keyline">One event opens a pro shop, a reorder, and a room full of new golfers.</p>
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
              <p className="rf-lead" key="a">YouTube golf is now a massive culture channel — Good Good, Bob Does Sports, Fore Play, Grant Horvat. The move isn&apos;t to become them; it&apos;s tasteful, golf-native media built from the Caddie Chronicles foundation that already exists.</p>,
              <div className="rf-formats" key="b">
                {mediaFormats.map(([title, body]) => (
                  <div className="rf-format" key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>,
              <p className="rf-keyline" key="c">The tone is &ldquo;I know what those are&rdquo; — never &ldquo;what is he wearing?&rdquo;</p>
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

      {/* Chapter 05 — The Payoff */}
      <BurstStatement
        heading={[{ text: "Everywhere" }, { text: "golf looks.", accent: true }]}
        kicker="Chapter 05 · The Payoff"
        sub="Don't get louder. Get more present — in every room where golf culture actually happens."
        theme="lime"
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
