"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const ndsEase = [0.22, 1, 0.36, 1] as const;

export function SqueezeSection({
  children,
  className = "",
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.15"]
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const rawRadius = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const scale = useSpring(rawScale, { stiffness: 120, damping: 30 });
  const borderRadius = useSpring(rawRadius, { stiffness: 120, damping: 30 });

  return (
    <div className="nds-squeeze-wrap" id={id} ref={ref}>
      <motion.section className={`nds-squeeze-inner ${className}`} style={{ scale, borderRadius }}>
        {children}
      </motion.section>
    </div>
  );
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      transition={{ duration: 0.62, ease: ndsEase }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
