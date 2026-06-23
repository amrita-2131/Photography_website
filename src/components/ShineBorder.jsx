import React, { useState } from 'react';
import './ShineBorder.css';

export default function ShineBorder({
  children,
  className = '',
  borderWidth = 2,
  duration = 3,
  colors = ['#814f66', '#E8A0BF', '#4A3F35'],
  hoverColors
}) {
  const [isHovered, setIsHovered] = useState(false);
  const activeColors = (isHovered && hoverColors) ? hoverColors : colors;
  const gradientStr = `conic-gradient(from 0deg, ${activeColors.join(', ')}, ${activeColors[0]})`;
  
  return (
    <div 
      className={`shine-border-wrapper ${className}`}
      style={{ padding: borderWidth }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shine-border-layer">
        <div 
          className="shine-border-gradient"
          style={{ 
            backgroundImage: gradientStr,
            animationDuration: `${duration}s`
          }}
        />
      </div>
      <div className="shine-border-content">
        {children}
      </div>
    </div>
  );
}
