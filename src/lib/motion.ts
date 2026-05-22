import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

export const ease = [0.16, 1, 0.3, 1] as const;

// ─── Variants ───────────────────────────────────────────────────────────────

export const fadeUp = (delay = 0, distance = 32) => ({
  hidden: { opacity: 0, y: distance },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
});

export const fadeDown = (delay = 0) => ({
  hidden: { opacity: 0, y: -28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } },
});

export const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay } },
});

export const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay } },
});

export const zoomIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.85 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.65, ease, delay } },
});

export const flipUp = (delay = 0) => ({
  hidden: { opacity: 0, rotateX: 30, y: 24 },
  show:   { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.65, ease, delay } },
});

export const stagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren, delayChildren } },
});

// ─── Parallax hook ───────────────────────────────────────────────────────────

export function useParallax(
  offset = 60,
): { ref: RefObject<HTMLElement | null>; y: MotionValue<number> } {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return { ref, y };
}
