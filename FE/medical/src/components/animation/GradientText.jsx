import React from "react";
import { motion } from "framer-motion";

export const GradientText = ({
  children,
  from = "from-blue-600",
  to = "to-indigo-600",
  via = "via-purple-500",
  animate = true,
  duration = 5,
  className = "",
  textClassName = "",
}) => {
  const gradientStyle = animate
    ? {
        backgroundSize: "200% 200%",
        backgroundPosition: ["0% 0%", "100% 100%"],
        transition: {
          duration: duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        },
      }
    : {};

  return (
    <motion.span
      className={`inline-block bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent ${className}`}
      animate={animate ? gradientStyle : {}}
    >
      <span className={textClassName}>{children}</span>
    </motion.span>
  );
};
