"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
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
  travel = 64
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
  const y = useTransform(progress, [begin, begin + 0.16], [40, 0]);
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
  end = 0.7
}: {
  children: string;
  progress: MotionValue<number>;
  start?: number;
  end?: number;
}) {
  const words = children.split(" ");
  return (
    <p className="rf-fill-text">
      {words.map((word, index) => (
        <FillWord end={end} index={index} key={`${word}-${index}`} progress={progress} start={start} total={words.length} word={word} />
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
    ["rgba(255, 248, 232, 0.26)", "rgba(255, 248, 232, 1)"]
  );
  return <motion.span style={{ color }}>{word}</motion.span>;
}

function StatBlock({
  value,
  label,
  bar,
  index,
  progress
}: {
  value: string;
  label: string;
  bar: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.2 + index * 0.05;
  const height = useTransform(progress, [start, start + 0.28], ["14%", bar]);
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const y = useTransform(progress, [start, start + 0.12], [30, 0]);
  return (
    <motion.div className="rf-stat" style={{ opacity, y }}>
      <motion.div className="rf-stat-bar" style={{ height }}>
        <strong>{value}</strong>
      </motion.div>
      <p>{label}</p>
    </motion.div>
  );
}

const stats = [
  {
    value: "48.1M",
    label: "Americans played golf on-course or off-course in 2025.",
    bar: "72%"
  },
  {
    value: "29.1M",
    label: "People played traditional on-course golf.",
    bar: "52%"
  },
  {
    value: "19M",
    label: "People only played off-course golf: ranges, simulators, and entertainment venues.",
    bar: "42%"
  },
  {
    value: "8.1M",
    label: "Women and girls played on-course golf, matching a record share.",
    bar: "34%"
  }
];

const pyramid = [
  ["Recognizable Brand", "The Great Golf Sock Renaissance"],
  ["Relationship Proof", "Caddies, PGA pros, Card Chasers, creators, trip captains"],
  ["Revenue Channels", "DTC drops, custom socks, pro shops, wholesale, licensed product"],
  ["Product Truth", "Made in America, distinctive designs, golf-specific comfort"]
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

export default function Home() {
  return (
    <main className="rf-page">
      <div className="rf-backdrop" aria-hidden />

      <div className="rf-official">
        <span className="rf-flag">DC</span>
        A candidate-built strategic initiative for Del Campo Golf
      </div>

      <nav className="rf-nav" aria-label="Public navigation">
        <a className="rf-brand" href="#top">
          Del Campo
        </a>
        <div className="rf-nav-links">
          <a href="#state">State of Golf</a>
          <a href="#gap">The Gap</a>
          <a href="#growth">The Growth Engine</a>
          <a href="#campaigns">Campaigns</a>
          <a href="/app/command-center">Strategy Center</a>
        </div>
      </nav>

      <ScrollScene className="rf-hero" height={2.2} id="top">
        {(progress) => {
          const titleY = useTransform(progress, [0, 0.24, 0.46], [0, -40, -360]);
          const titleOpacity = useTransform(progress, [0, 0.32, 0.46], [1, 1, 0]);
          const titleLetter = useTransform(progress, [0, 0.45], ["-0.11em", "-0.07em"]);
          const copyOpacity = useTransform(progress, [0, 0.5, 0.68], [1, 1, 0]);
          const cardY = useTransform(progress, [0, 0.3, 0.62, 0.92], [380, 40, -120, -280]);
          const cardScale = useTransform(progress, [0, 0.34, 0.78, 1], [0.92, 1, 1, 1.06]);
          const cardOpacity = useTransform(progress, [0.74, 0.94], [1, 0]);
          const scrollCueOpacity = useTransform(progress, [0, 0.16, 0.28], [1, 0.5, 0]);
          return (
            <>
              <div className="rf-hero-inner">
                <motion.h1 style={{ letterSpacing: titleLetter, opacity: titleOpacity, y: titleY }}>
                  Golf Socks
                  <br />
                  Can Win
                </motion.h1>
                <motion.div style={{ opacity: copyOpacity }}>
                  <FillText progress={progress} start={0.08} end={0.42}>
                    Golf is bigger, younger, more social, more visual, and more commercially fragmented than ever. Del Campo can turn the most overlooked thing every golfer already wears into a recognizable golf culture brand.
                  </FillText>
                </motion.div>
              </div>

              <motion.div className="rf-hero-card" style={{ opacity: cardOpacity, scale: cardScale, y: cardY }}>
                <div className="rf-product-wall">
                  {productImages.concat(productImages).map((image, index) => (
                    <img alt={image.name} key={`${image.name}-${index}`} src={image.src} />
                  ))}
                </div>
                <div className="rf-video-pill">
                  The Great Golf Sock Renaissance <span>▶</span>
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
              <h2>
                The game is
                <br />
                expanding.
                <br />
                The data is clear.
              </h2>
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
                Golf has upgraded
                <br />
                everything but the sock drawer.
              </h2>
              <FillText progress={progress} start={0.24} end={0.7}>
                Clubs became technology. Shoes became performance. Polos became identity. Hats became collectable. Socks still sit underneath the category, even though they are visible, giftable, customizable, affordable, repeatable, and perfect for trips, pro shops, tournaments, college fandom, and corporate golf.
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
              <h2>
                The ingredients
                <br />
                already exist.
              </h2>
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

      <ScrollScene className="rf-growth" id="growth">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">The how</span>
              <h2>
                Build the
                <br />
                Growth Pyramid.
              </h2>
            </div>
            <div className="rf-pyramid" aria-label="Del Campo growth pyramid">
              {pyramid.map(([title, body], index) => (
                <Stagger className={`rf-pyramid-tier tier-${index}`} index={index} key={title} progress={progress} start={0.24} step={0.07}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </Stagger>
              ))}
            </div>
          </SceneBody>
        )}
      </ScrollScene>

      <ScrollScene className="rf-campaigns" id="campaigns">
        {(progress) => (
          <SceneBody progress={progress}>
            <div className="rf-center-copy">
              <span className="rf-kicker">The first moves</span>
              <h2>
                Campaigns become
                <br />
                the operating system.
              </h2>
              <FillText progress={progress} start={0.2} end={0.48}>
                Each campaign should connect story, product, creative, channel, relationship, and target metric. That is how Del Campo moves from sock brand to recognizable golf institution.
              </FillText>
            </div>
            <div className="rf-campaign-stack">
              {campaigns.slice(0, 6).map((campaign, index) => (
                <Stagger
                  className="rf-campaign"
                  href={`/app/campaigns/${campaign.id}`}
                  index={index}
                  key={campaign.id}
                  progress={progress}
                  start={0.34}
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
                From small sock brand
                <br />
                to golf's most recognizable sock company.
              </h2>
              <FillText progress={progress} start={0.2} end={0.6}>
                The vision is not a better dashboard. It is a public brand story, backed by a practical marketing system: DTC drops, custom/event revenue, pro-shop distribution, relationship proof, creative production, performance targets, and AI-assisted operations.
              </FillText>
              <Stagger className="rf-cta-wrap" index={0} progress={progress} start={0.58} step={0}>
                <a className="rf-cta" href="/app/command-center">
                  Open the strategy center <ArrowRight size={22} />
                </a>
              </Stagger>
            </div>
          </SceneBody>
        )}
      </ScrollScene>
    </main>
  );
}
