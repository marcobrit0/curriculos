"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type SlideTransitionProps = {
  children: React.ReactNode;
  direction: "forward" | "backward";
  keyProp: string; // unique per step to trigger animation
};

export default function SlideTransition({
  children,
  direction,
  keyProp,
}: SlideTransitionProps) {
  const isForward = direction === "forward";

  const variants = {
    initial: { x: isForward ? "100%" : "-100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: isForward ? "-100%" : "100%", opacity: 1 },
  };

  const transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="min-h-70 relative w-full overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={keyProp}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
