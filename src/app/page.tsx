"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { campaigns, productImages } from "@/lib/strategy";

type SceneProps = {
  id?: string;
  className?: string;
  first?: boolean;
  children: (progress: MotionValue<number>) => React.ReactNode;
};

function ScrollScene({ id, className = "", first = false, children }: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(
    scrollYProgress,
    first ? [0, 0.74, 1] : [0, 0.14, 0.82, 1],
    first ? [0, -24, -220] : [160, 0, 0, -190]
  );
  const scale = useTransform(
    scrollYProgress,
    first ? [0, 0.76, 1] : [0, 0.14, 0.82, 1],
    first ? [1, 1, 0.92] : [0.9, 1, 1, 0.94]
  );

  return (
    <section className={`rf-scene ${className}`} id={id} ref={ref}>
      <motion.div className="rf-sticky" style={first ? { scale, y } : undefined}>
        {children(scrollYProgress)}
      </motion.div>
    </section>
  );
}

function FillText({
  children,
  progress,
  start = 0.22,
  end = 0.74
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
  const color = useTransform(progress, [wordStart, wordStart + step * 1.8], ["rgba(255, 248, 232, 0.58)", "#fff8e8"]);
  const opacity = useTransform(progress, [wordStart, wordStart + step * 1.8], [0.9, 1]);
  const y = useTransform(progress, [wordStart, wordStart + step * 1.8], [12, 0]);
  return (
    <motion.span style={{ color, opacity, y }}>
      {word}
    </motion.span>
  );
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
  const start = index * 0.035;
  const height = useTransform(progress, [start, start + 0.26], ["16%", bar]);
  const opacity = useTransform(progress, [0, 0.04], [0.92, 1]);
  const y = useTransform(progress, [start, start + 0.16], [30, 0]);
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

      <ScrollScene className="rf-hero" first id="top">
        {(progress) => {
          const cardY = useTransform(progress, [0, 0.26, 0.58, 0.9], [410, 60, -130, -260]);
          const cardScale = useTransform(progress, [0, 0.34, 0.76, 1], [0.92, 1, 1, 1.08]);
          const titleY = useTransform(progress, [0, 0.22, 0.5], [0, -50, -520]);
          const titleOpacity = useTransform(progress, [0, 0.34, 0.5], [1, 1, 0]);
          const copyOpacity = useTransform(progress, [0, 0.58, 0.78], [1, 1, 0]);
          const scrollCueOpacity = useTransform(progress, [0, 0.18, 0.3], [1, 0.5, 0]);
          return (
            <>
              <div className="rf-hero-inner">
                <motion.h1 style={{ letterSpacing: useTransform(progress, [0, 0.45], ["-0.11em", "-0.07em"]), opacity: titleOpacity, y: titleY }}>
                  Golf Socks
                  <br />
                  Can Win
                </motion.h1>
                <motion.div style={{ opacity: copyOpacity }}>
                  <FillText progress={progress} start={0.08} end={0.44}>
                    Golf is bigger, younger, more social, more visual, and more commercially fragmented than ever. Del Campo can turn the most overlooked thing every golfer already wears into a recognizable golf culture brand.
                  </FillText>
                </motion.div>
              </div>

              <motion.div className="rf-hero-card" style={{ scale: cardScale, y: cardY }}>
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

      <ScrollScene className="rf-state" id="state">
        {(progress) => (
          <>
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
          </>
        )}
      </ScrollScene>

      <ScrollScene className="rf-gap" id="gap">
        {(progress) => (
          <>
            <div className="rf-split-copy">
              <span className="rf-kicker">The category gap</span>
              <h2>
                Golf has upgraded
                <br />
                everything but the sock drawer.
              </h2>
              <FillText progress={progress} start={0.26} end={0.72}>
                Clubs became technology. Shoes became performance. Polos became identity. Hats became collectable. Socks still sit underneath the category, even though they are visible, giftable, customizable, affordable, repeatable, and perfect for trips, pro shops, tournaments, college fandom, and corporate golf.
              </FillText>
            </div>
            <motion.div
              className="rf-big-line"
              style={{
                opacity: useTransform(progress, [0.32, 0.62, 0.92], [0, 0.22, 0]),
                x: useTransform(progress, [0.2, 0.92], ["-8%", "-50%"])
              }}
            >
              SOCKS ARE NOT SMALL.
            </motion.div>
          </>
        )}
      </ScrollScene>

      <ScrollScene className="rf-why">
        {(progress) => (
          <>
            <div className="rf-center-copy">
              <span className="rf-kicker">Why Del Campo</span>
              <h2>
                The ingredients
                <br />
                already exist.
              </h2>
              <FillText progress={progress} start={0.24} end={0.66}>
                Made in America. Distinctive designs. Custom-ready product. Licensed categories. PGA TOUR Fan Shop presence. Big-box distribution. Hundreds of pro-shop footholds. The next step is not more random marketing. It is turning those assets into a public story and an operating system.
              </FillText>
            </div>
            <div className="rf-token-field">
              {scope.map((item, index) => {
                const start = 0.28 + index * 0.045;
                const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
                const y = useTransform(progress, [start, start + 0.12], [30, 0]);
                return (
                  <motion.span className="rf-token" key={item} style={{ opacity, y }}>
                    {item}
                  </motion.span>
                );
              })}
            </div>
          </>
        )}
      </ScrollScene>

      <ScrollScene className="rf-growth" id="growth">
        {(progress) => (
          <>
            <div className="rf-center-copy">
              <span className="rf-kicker">The how</span>
              <h2>
                Build the
                <br />
                Growth Pyramid.
              </h2>
            </div>
            <div className="rf-pyramid" aria-label="Del Campo growth pyramid">
              {pyramid.map(([title, body], index) => {
                const start = 0.2 + index * 0.11;
                const opacity = useTransform(progress, [start, start + 0.16], [0, 1]);
                const x = useTransform(progress, [start, start + 0.16], [index % 2 ? 100 : -100, 0]);
                return (
                  <motion.div className={`rf-pyramid-tier tier-${index}`} key={title} style={{ opacity, x }}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </ScrollScene>

      <ScrollScene className="rf-campaigns" id="campaigns">
        {(progress) => (
          <>
            <div className="rf-center-copy">
              <span className="rf-kicker">The first moves</span>
              <h2>
                Campaigns become
                <br />
                the operating system.
              </h2>
              <FillText progress={progress} start={0.22} end={0.52}>
                Each campaign should connect story, product, creative, channel, relationship, and target metric. That is how Del Campo moves from sock brand to recognizable golf institution.
              </FillText>
            </div>
            <div className="rf-campaign-stack">
              {campaigns.slice(0, 6).map((campaign, index) => {
                const start = 0.34 + index * 0.055;
                const opacity = useTransform(progress, [start, start + 0.13], [0, 1]);
                const y = useTransform(progress, [start, start + 0.13], [54, 0]);
                return (
                  <motion.a className="rf-campaign" href={`/app/campaigns/${campaign.id}`} key={campaign.id} style={{ opacity, y }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{campaign.title}</strong>
                    <p>{campaign.thesis}</p>
                  </motion.a>
                );
              })}
            </div>
          </>
        )}
      </ScrollScene>

      <ScrollScene className="rf-final">
        {(progress) => (
          <div className="rf-center-copy">
            <span className="rf-kicker">The where</span>
            <h2>
              From small sock brand
              <br />
              to golf's most recognizable sock company.
            </h2>
            <FillText progress={progress} start={0.22} end={0.66}>
              The vision is not a better dashboard. It is a public brand story, backed by a practical marketing system: DTC drops, custom/event revenue, pro-shop distribution, relationship proof, creative production, performance targets, and AI-assisted operations.
            </FillText>
            <motion.a className="rf-cta" href="/app/command-center" style={{ opacity: useTransform(progress, [0.54, 0.72], [0, 1]), y: useTransform(progress, [0.54, 0.72], [28, 0]) }}>
              Open the strategy center <ArrowRight size={22} />
            </motion.a>
          </div>
        )}
      </ScrollScene>
    </main>
  );
}
