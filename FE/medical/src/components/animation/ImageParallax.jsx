import React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ImageParallax = ({
  src,
  alt = "",
  speed = 0.5,
  direction = "up",
  className = "",
  imgClassName = "",
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate transform based on direction
  const getYTransform = () => {
    // For upward/downward movement
    if (direction === "up") {
      return useTransform(scrollYProgress, [0, 1], ["0%", `-${speed * 20}%`]);
    } else if (direction === "down") {
      return useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 20}%`]);
    }
    return 0;
  };

  const getXTransform = () => {
    // For horizontal movement
    if (direction === "left") {
      return useTransform(scrollYProgress, [0, 1], ["0%", `-${speed * 20}%`]);
    } else if (direction === "right") {
      return useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 20}%`]);
    }
    return 0;
  };

  const y = getYTransform();
  const x = getXTransform();

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        style={{ y, x }}
      />
    </div>
  );
};
