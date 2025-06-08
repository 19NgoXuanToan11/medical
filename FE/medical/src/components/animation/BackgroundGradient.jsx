import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  containerClassName = "",
  className = "",
  interactive = true,
  duration = 5,
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <motion.div
        className={`absolute inset-0 rounded-xl blur-xl opacity-50 ${className}`}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundSize: "200% 200%",
          backgroundImage:
            "linear-gradient(to right, var(--tw-gradient-stops))",
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-xl opacity-20 ${className}`}
        animate={{
          backgroundPosition: ["100% 100%", "0% 0%"],
        }}
        transition={{
          duration: duration * 1.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundSize: "200% 200%",
          backgroundImage:
            "linear-gradient(to right, var(--tw-gradient-stops))",
          filter: "blur(1px)",
        }}
      />
      <motion.div
        className="relative rounded-xl"
        whileHover={interactive ? { scale: 1.02, translateY: -5 } : {}}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
