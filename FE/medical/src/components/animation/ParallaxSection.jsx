import React from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export const ParallaxSection = ({
  children,
  pages = 1,
  className = "",
  background,
  layers = [],
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Parallax pages={pages} className="w-full">
        {/* Background layer if provided */}
        {background && (
          <ParallaxLayer
            offset={0}
            speed={0}
            factor={pages}
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
            }}
          />
        )}

        {/* Custom parallax layers */}
        {layers.map((layer, index) => (
          <ParallaxLayer
            key={index}
            offset={layer.offset || 0}
            speed={layer.speed || 0}
            factor={layer.factor || 1}
            style={layer.style || {}}
            className={layer.className || ""}
          >
            {layer.content}
          </ParallaxLayer>
        ))}

        {/* Default content layer */}
        <ParallaxLayer
          offset={0}
          speed={0.5}
          className="flex items-center justify-center"
        >
          {children}
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default ParallaxSection;
