"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  // Determine shape classes based on variant
  const shapeClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded h-4 w-full"
      : "rounded-xl";

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      className={`relative overflow-hidden bg-slate-200/80 dark:bg-zinc-800/80 ${shapeClass} ${className}`}
      style={style}
    >
      {/* Shimmer overlay using Framer Motion */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-100/40 to-transparent dark:via-zinc-700/20"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.6,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
