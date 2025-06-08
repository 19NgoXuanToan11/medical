import React from "react";
import { motion } from "framer-motion";

export const ShimmerButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  shimmerColor = "rgba(255, 255, 255, 0.1)",
  shimmerSize = "200%",
  shimmerDuration = 3,
  type = "button",
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          backgroundSize: shimmerSize,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: shimmerDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </motion.button>
  );
};
