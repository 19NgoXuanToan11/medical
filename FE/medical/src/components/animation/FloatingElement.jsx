import React from "react";
import { motion } from "framer-motion";

export const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
  amount = 10,
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [`${amount * -1}px`, `${amount}px`, `${amount * -1}px`],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};
