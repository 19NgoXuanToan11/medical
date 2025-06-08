import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export const ScrollAnimatedCounter = ({
  value = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  easingFn = "easeOut",
  startOnScroll = true,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    let animationFrameId;
    let startTime;
    let startValue = 0;
    let endValue = value;

    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      let easing;
      switch (easingFn) {
        case "easeIn":
          easing = (t) => t * t;
          break;
        case "easeOut":
          easing = (t) => 1 - Math.pow(1 - t, 2);
          break;
        case "easeInOut":
          easing = (t) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          break;
        default:
          easing = (t) => t;
      }

      const easedProgress = easing(progress);
      const currentValue = Math.floor(
        startValue + easedProgress * (endValue - startValue)
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      }
    };

    if ((isInView || !startOnScroll) && !hasAnimated.current) {
      controls.start({ opacity: 1, y: 0 });
      animationFrameId = requestAnimationFrame(updateCounter);
      hasAnimated.current = true;
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, value, duration, controls, startOnScroll, easingFn]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.div>
  );
};

export default ScrollAnimatedCounter;
