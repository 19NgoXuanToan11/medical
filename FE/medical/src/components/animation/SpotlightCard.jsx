import React, { useState, useRef } from "react";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightSize = 300,
  spotlightColor = "rgba(176, 215, 255, 0.2)",
  borderRadius = "0.5rem",
  background = "rgba(24, 24, 27, 0.5)",
  border = "1px solid rgba(63, 63, 70, 0.5)",
}) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const spotlightStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    height: `${spotlightSize}px`,
    width: `${spotlightSize}px`,
    borderRadius: "50%",
    background: `radial-gradient(circle at center, ${spotlightColor} 0%, transparent 70%)`,
    transform: `translate(${position.x - spotlightSize / 2}px, ${
      position.y - spotlightSize / 2
    }px)`,
    opacity,
    transition: "opacity 0.15s ease",
    pointerEvents: "none",
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius,
        background,
        border,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={spotlightStyles} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
