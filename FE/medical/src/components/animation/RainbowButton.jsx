import React from "react";
import { motion } from "framer-motion";

export const RainbowButton = ({
  children,
  className = "",
  hoverScale = 1.05,
  colors = ["#ff0080", "#7928ca", "#0070f3", "#00c5b8", "#f5a623", "#ff0080"],
  duration = 2,
  onClick,
  ...props
}) => {
  const rainbowGradient = {
    backgroundSize: "400% 100%",
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
  };

  const buttonVariants = {
    idle: {
      backgroundPosition: "0% 0%",
      scale: 1,
      transition: {
        backgroundPosition: {
          duration: 0,
        },
      },
    },
    hover: {
      backgroundPosition: "100% 0%",
      scale: hoverScale,
      transition: {
        backgroundPosition: {
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        },
        scale: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg px-5 py-2.5 font-medium text-white shadow-md ${className}`}
      style={rainbowGradient}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default RainbowButton;
