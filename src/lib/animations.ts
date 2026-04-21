import { ANIMATION_DURATION } from "./constants";

/**
 * Fade up animation variant for Framer Motion
 * @param delay - Delay before animation starts (in seconds)
 */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: ANIMATION_DURATION.slow, delay },
});

/**
 * Fade in animation variant
 * @param delay - Delay before animation starts (in seconds)
 */
export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

/**
 * Slide in from left animation variant
 * @param delay - Delay before animation starts (in seconds)
 */
export const slideInLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

/**
 * Slide in from right animation variant
 * @param delay - Delay before animation starts (in seconds)
 */
export const slideInRight = (delay = 0) => ({
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

/**
 * Scale in animation variant
 * @param delay - Delay before animation starts (in seconds)
 */
export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: ANIMATION_DURATION.normal, delay },
});

/**
 * Floating animation for continuous up/down movement
 * @param distance - Distance to move (in pixels)
 * @param duration - Duration of one cycle (in seconds)
 */
export const floating = (distance = 8, duration = 3) => ({
  animate: { y: [0, -distance, 0] },
  transition: {
    duration,
    repeat: Infinity as number,
    ease: "easeInOut" as const,
  },
});
