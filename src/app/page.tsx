"use client";

import { Fragment, useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { campaigns, productImages } from "@/lib/strategy";

type SceneProps = {
  id?: string;
  className?: string;
  height?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
};

/**
 * A pinned scene. The section is taller than the viewport; the inner panel
 * sticks to the top for the duration, so the page stays visually stagnant
 * while only the content inside transitions. `progress` runs 0 -> 1 across
 * the pinned travel.
 */
function ScrollScene({ id, className = "", height = 1.9, children }: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <section className={`rf-scene ${className}`} id={id} ref={ref} style={{ minHeight: `${height * 100}vh` }}>
      <div className="rf-sticky">{children(scrollYProgress)}</div>
    </section>
  );
}

/**
 * Wraps a scene's content so it animates IN as the scene pins and OUT as it
 * releases: rise + fade + a soft focus-in. This is what makes the words feel
 * like they "come and go" while the background holds still.
 */
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
  const filter = useTransform(
    progress,
    [0, enter, exit, 1],
    ["blur(7px)", "blur(0px)", "blur(0px)", "blur(7px)"]
  );
  return (
    <motion.div className="rf-body" style={{ opacity, y, filter }}>
      {children}
    </motion.div>
  );
}

/**
 * Staggered child that slides up into place during the scene's hold window.
 * Exit is handled by the parent SceneBody, so this only does the entrance.
 */
function Stagger({
  children,
  progress,
  index,
  start = 0.2,
  step = 0.05,
  className,
  ...rest
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  start?: number;
  step?: number;
  className?: string;
  href?: string;
}) {
  const begin = start + index * step;
  const opacity = useTransform(progress, [begin, begin + 0.16], [0, 1]);
  const y = useTransform(progress, [begin, begin + 0.16], [36, 0]);
  const Tag = rest.href ? motion.a : motion.div;
  return (
    <Tag className={className} style={{ opacity, y }} {...rest}>
      {children}
    </Tag>
  );
}

function FillText({
  children,
  progress,
  start = 0.22,
  end = 0.7,
  className = ""
}: {
  children: string;
  progress: MotionValue<number>;
  start?: number;
  end?: number;
  className?: string;
}) {
  const words = children.split(" ");
  return (
    <p className={`rf-fill-text ${className}`}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <FillWord end={end} index={index} progress={progress} start={start} total={words.length} word={word} />
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

function FillWord({
  word,
  index,
  total,
  progress,
  start,
  end
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const step = (end - start) / Math.max(total, 1);
  const wordStart = start + index * step;
  const color = useTransform(
    progress,
    [wordStart, wordStart + step * 2.2],
    ["rgba(251, 247, 236, 0.26)", "rgba(251, 247, 236, 1)"]
  );
  return <motion.span style={{ color }}>{word}</motion.span>;
}

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

const stats = [
  { value: "48.1M", label: "Americans played golf on-course or off-course in 2025.", bar: "72%", accent: "var(--rf-lime)" },
  { value: "29.1M", label: "People played traditional on-course golf.", bar: "52%", accent: "var(--rf-gold)" },
  { value: "19M", label: "People only played off-course golf: ranges, simulators, and entertainment venues.", bar: "42%", accent: "var(--rf-teal)" },
  { value: "8.1M", label: "Women and girls played on-course golf, matching a record share.", bar: "34%", accent: "var(--rf-coral)" }
];

const scope = [
  "DTC demand",
  "Custom socks",
  "Green grass pro shops",
  "Wholesale / retail",
  "College licensed drops",
  "Caddies + PGA pros",
  "Creators + trip captains",
  "Creative + AI operations"
];

// Repeated product set for the hero marquee; each row renders it twice for a seamless loop.
const marqueeSocks = [...productImages, ...productImages, ...productImages];

const flywheel = [
  {
    label: "Discover",
    copy: "Find the people, accounts, and moments that can move the brand.",
    action: "Score 25 caddie, creator, and pro-shop prospects by fit, reach, and revenue potential.",
    modules: "Relationship CRM · Distribution Pipeline",
    metric: "Qualified prospects added / week",
    accent: "var(--rf-teal)"
  },
  {
    label: "Activate",
    copy: "Turn prospects into structured growth opportunities.",
    action: "Send a Caddie Crew kit with a referral code, content prompt, and follow-up task.",
    modules: "CRM · Campaign Builder · Distribution · AI Queue",
    metric: "Activations launched / week",
    accent: "var(--rf-gold)"
  },
  {
    label: "Capture",
    copy: "Collect the proof, content, leads, and intros each activation creates.",
    action: "Turn a caddie's on-course sock photo into an approved UGC asset with reuse rights.",
    modules: "Creative Studio · CRM · Distribution",
    metric: "UGC assets & leads captured",
    accent: "var(--rf-coral)"
  },
  {
    label: "Convert",
    copy: "Turn attention and relationships into revenue.",
    action: "Route a corporate outing into a custom sock proposal with order value and next step.",
    modules: "Campaign Builder · Distribution · Performance",
    metric: "Revenue & orders closed",
    accent: "var(--rf-lime)"
  },
  {
    label: "Recycle",
    copy: "Reuse the best-performing proof across every growth channel.",
    action: "Turn high-performing trip UGC into a paid social test and an email hero.",
    modules: "Creative Studio · Campaign Builder · Performance · AI Queue",
    metric: "Assets reused across channels",
    accent: "var(--rf-gold)"
  },
  {
    label: "Expand",
    copy: "Use every win to open the next relationship, account, or channel.",
    action: "Use a successful pro-shop sample pack to trigger outreach to five similar clubs.",
    modules: "Command Center · AI Queue · CRM · Distribution",
    metric: "Referrals & new accounts opened",
    accent: "var(--rf-teal)"
  }
];

/**
 * Scroll-driven growth flywheel. As the scene pins, scrolling steps the active
 * blade around the wheel (no clicking) and updates the detail card beside it.
 */
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
        <span className="rf-kicker">The system</span>
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
            <span>The sock brand golf actually talks about.</span>
          </div>
          {flywheel.map((s, i) => (
            <div
              className={`rf-fly-blade ${i === active ? "is-active" : ""}`}
              key={s.label}
              style={{ "--a": `${i * (360 / count)}deg`, "--accent": s.accent } as React.CSSProperties}
            >
              <span className="rf-fly-dot" />
              <em>{s.label}</em>
            </div>
          ))}
        </div>

        <div className="rf-fly-detail" style={{ borderColor: stage.accent }}>
          <span className="rf-fly-step" style={{ color: stage.accent }}>
            Stage {active + 1} / {count}
          </span>
          <strong className="rf-fly-name">{stage.label}</strong>
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

      {/* Mobile: the wheel collapses to a readable stacked list. */}
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

export default function Home() {
  const [theme, setTheme] = useState<"dusk" | "day">("dusk");
  return (
    <main className={`rf-page ${theme === "day" ? "rf-day" : ""}`}>
      <div className="rf-backdrop" aria-hidden />

      <div className="rf-theme-toggle" role="group" aria-label="Color theme">
        <button className={theme === "dusk" ? "is-on" : ""} onClick={() => setTheme("dusk")} type="button">
          Dusk
        </button>
        <button className={theme === "day" ? "is-on" : ""} onClick={() => setTheme("day")} type="button">
          Daylight
        </button>
      </div>

      <div className="rf-official">
        <span className="rf-flag">FL</span>
        Made in the USA · A candidate-built growth plan for Del Campo Golf
      </div>

      <nav className="rf-nav" aria-label="Public navigation">
        {/* TODO: replace wordmark with Del Campo logo asset */}
        <a className="rf-brand" href="#top">
          Del Campo
        </a>
        <div className="rf-nav-links">
          <a href="#state">State of Golf</a>
          <a href="#gap">The Gap</a>
          <a href="#flywheel">The Flywheel</a>
          <a href="#campaigns">Campaigns</a>
          <a href="/app/command-center">Strategy Center</a>
        </div>
      </nav>

      <ScrollScene className="rf-hero" height={1.9} id="top">
        {(progress) => {
          const headOpacity = useTransform(progress, [0, 0.12, 0.64, 0.85], [0, 1, 1, 0]);
          const headY = useTransform(progress, [0, 0.12, 0.64, 0.85], [44, 0, 0, -90]);
          const headScale = useTransform(progress, [0, 0.5], [1, 1.05]);
          const marqueeOpacity = useTransform(progress, [0.05, 0.26, 0.7, 0.9], [0, 1, 1, 0]);
          const marqueeY = useTransform(progress, [0, 0.26, 0.7, 0.9], [90, 0, 0, -64]);
          const scrollCueOpacity = useTransform(progress, [0, 0.16, 0.28], [1, 0.5, 0]);
          return (
            <>
              <motion.div className="rf-hero-head" style={{ opacity: headOpacity, y: headY, scale: headScale }}>
                <span className="rf-kicker">Born on a Florida muni · Made in the USA</span>
                <h1>
                  Golf Socks
                  <br />
                  <span className="rf-hero-accent">Can Win.</span>
                </h1>
                <FillText className="rf-hero-fill" progress={progress} start={0.1} end={0.44}>
                  Golf is bigger, younger, more social, and more commercially fragmented than ever. Del Campo can turn the most overlooked thing every golfer already wears into a brand golf actually talks about.
                </FillText>
              </motion.div>

              {/* WOW element: dual rows of real product streaming in opposite directions */}
              <motion.div className="rf-hero-marquee" style={{ opacity: marqueeOpacity, y: marqueeY }} aria-hidden>
                <div className="rf-marquee-row rf-marquee-row--a">
                  {marqueeSocks.concat(marqueeSocks).map((img, i) => (
                    <div className="rf-sock" key={`a-${i}`}>
                      <img alt="" src={img.src} />
                    </div>
                  ))}
                </div>
                <div className="rf-marquee-row rf-marquee-row--b">
                  {marqueeSocks.concat(marqueeSocks).map((img, i) => (
                    <div className="rf-sock" key={`b-${i}`}>
                      <img alt="" src={img.src} />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.a className="rf-scroll" href="#state" aria-label="Scroll to next section" style={{ opacity: scrollCueOpacity }}>
                <ChevronDown />
              </motion.a>
            </>
          );
        }}
      </ScrollScene>

      <ScrollScene className="rf-state" height={2.1} id="state">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">The State of Golf</span>
              <h2>The game is expanding. The data is clear.</h2>
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

      <ScrollScene className="rf-gap" id="gap">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-split-copy">
              <span className="rf-kicker">The category gap</span>
              <h2>
                Golf upgraded everything
                <br />
                but the sock drawer.
              </h2>
              <FillText progress={progress} start={0.24} end={0.7}>
                Clubs became technology. Shoes became performance. Polos became identity. Hats became collectable. Socks still sit underneath the category, even though they are visible, giftable, customizable, affordable, and perfect for trips, pro shops, tournaments, college fandom, and corporate golf.
              </FillText>
            </div>
          </SceneBody>
        )}
      </ScrollScene>

      <ScrollScene className="rf-why">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">Why Del Campo</span>
              <h2>The ingredients already exist.</h2>
              <FillText progress={progress} start={0.22} end={0.6}>
                Made in America. Distinctive designs. Custom-ready product. Licensed categories. PGA TOUR Fan Shop presence. Big-box distribution. Hundreds of pro-shop footholds. The next step is not more random marketing. It is turning those assets into a public story and an operating system.
              </FillText>
            </div>
            <div className="rf-token-field">
              {scope.map((item, index) => (
                <Stagger className="rf-token" index={index} key={item} progress={progress} start={0.3} step={0.04}>
                  {item}
                </Stagger>
              ))}
            </div>
          </SceneBody>
        )}
      </ScrollScene>

      <ScrollScene className="rf-flywheel" height={3.6} id="flywheel">
        {(progress) => <GrowthFlywheel progress={progress} />}
      </ScrollScene>

      <ScrollScene className="rf-campaigns" id="campaigns">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">The first moves</span>
              <h2>Campaigns become the operating system.</h2>
            </div>
            <div className="rf-campaign-stack">
              {campaigns.slice(0, 6).map((campaign, index) => (
                <Stagger
                  className="rf-campaign"
                  href={`/app/campaigns/${campaign.id}`}
                  index={index}
                  key={campaign.id}
                  progress={progress}
                  start={0.26}
                  step={0.045}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{campaign.title}</strong>
                  <p>{campaign.thesis}</p>
                </Stagger>
              ))}
            </div>
          </SceneBody>
        )}
      </ScrollScene>

      <ScrollScene className="rf-final">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">The where</span>
              <h2>
                From small sock brand to golf&apos;s
                <br />
                most recognizable sock company.
              </h2>
              <FillText progress={progress} start={0.2} end={0.58}>
                The vision is a public brand story backed by a practical marketing system: DTC drops, custom and event revenue, pro-shop distribution, relationship proof, creative production, performance targets, and AI-assisted operations.
              </FillText>
              <Stagger className="rf-cta-wrap" index={0} progress={progress} start={0.56} step={0}>
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
