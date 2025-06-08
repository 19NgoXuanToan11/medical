import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const MagneticEffect = ({
  children,
  className = "",
  strength = 50,
  tolerance = 0.5,
  scale = 1.05,
  onClick,
}) => {
  const magnetRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      magnetRef.current.getBoundingClientRect();

    // Calculate the center point of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from mouse to center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Calculate magnetic pull (stronger when closer to center)
    const magneticX = distanceX * tolerance;
    const magneticY = distanceY * tolerance;

    setPosition({ x: magneticX, y: magneticY });
  };

  const handleMouseLeave = () => {
    // Reset position with animation
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={magnetRef}
      className={`inline-block touch-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
        scale: position.x || position.y ? scale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticEffect;
