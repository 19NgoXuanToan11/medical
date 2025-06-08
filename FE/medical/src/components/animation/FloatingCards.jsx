import React, { useState } from "react";
import { motion } from "framer-motion";

export const FloatingCards = ({
  children,
  className = "",
  tiltDegree = 15,
  perspective = 1000,
  scale = 1.05,
  shadow = true,
  shadowColor = "rgba(0, 0, 0, 0.2)",
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    // Calculate position on card (from -1 to 1)
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    // Map to rotation degrees
    const rotateX = -y * tiltDegree;
    const rotateY = x * tiltDegree;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const cardVariants = {
    rest: {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: shadow ? `0px 10px 30px -5px ${shadowColor}` : "none",
    },
    hover: {
      rotateX: tilt.x,
      rotateY: tilt.y,
      scale: scale,
      boxShadow: shadow ? `0px 30px 100px -10px ${shadowColor}` : "none",
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  return (
    <motion.div
      className={`${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: `${perspective}px` }}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      variants={cardVariants}
      transition={{
        rotateX: { type: "spring", damping: 15, stiffness: 150 },
        rotateY: { type: "spring", damping: 15, stiffness: 150 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCards;
