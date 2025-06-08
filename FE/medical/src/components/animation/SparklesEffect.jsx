import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const generateSparkle = (color) => {
  const sparkle = {
    id: String(Math.random()),
    createdAt: Date.now(),
    color,
    size: Math.random() * 20 + 10,
    style: {
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      zIndex: 2,
    },
  };
  return sparkle;
};

const Sparkle = ({ size, color, style }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className="absolute pointer-events-none"
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate: 180, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.36, 0.66, 0.04, 1],
      }}
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </motion.svg>
  );
};

export const SparklesEffect = ({
  children,
  color = "#FFC700",
  interval = 500,
  minDuration = 1000,
  maxDuration = 2000,
  className = "",
}) => {
  const [sparkles, setSparkles] = useState([]);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to create a new sparkle
    const createSparkle = () => {
      // Add a new sparkle
      setSparkles((currentSparkles) => [
        ...currentSparkles,
        generateSparkle(color),
      ]);

      // Schedule the next sparkle
      timeoutRef.current = setTimeout(createSparkle, Math.random() * interval);
    };

    // Start creating sparkles
    createSparkle();

    // Clean up function
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [color, interval]);

  // Remove sparkles after they've displayed for a random duration
  useEffect(() => {
    if (sparkles.length === 0) return;

    const removeSparkle = () => {
      setSparkles((currentSparkles) => {
        const now = Date.now();
        return currentSparkles.filter((sparkle) => {
          const duration =
            minDuration + Math.random() * (maxDuration - minDuration);
          return now - sparkle.createdAt < duration;
        });
      });
    };

    const cleanupInterval = setInterval(removeSparkle, 100);
    return () => clearInterval(cleanupInterval);
  }, [sparkles, minDuration, maxDuration]);

  return (
    <div className={`inline-block relative ${className}`} ref={containerRef}>
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            color={sparkle.color}
            size={sparkle.size}
            style={sparkle.style}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SparklesEffect;
