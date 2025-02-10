import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FadeInFromDown = {
  visible: ({ delay }: { delay: number; y: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.6,
      ease: [0.6, 0.01, -0.05, 0.95],
      delay,
    },
  }),
  hidden: ({ delay, y = 200 }: { delay: number; y: number }) => ({
    opacity: 0,
    y,
  }),
};

export const FadeInFromUp = {
  visible: ({ delay }: { delay: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.6,
      ease: [0.6, 0.01, -0.05, 0.95],
      delay,
    },
  }),
  hidden: { opacity: 0, y: -200, rotate: "0deg" },
};
