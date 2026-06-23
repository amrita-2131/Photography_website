import React, { useState } from 'react';
import './FlippingCard.css';

export default function FlippingCard({ 
  className = '', 
  frontContent, 
  backContent 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleFlip = () => {
    // Only toggle if we are on a touch device, else CSS hover handles it naturally
    // A simple check is to flip on click, which works for both, but we don't want 
    // click to conflict with internal buttons.
    // Instead of forcing it, we toggle class. If a button inside handles event propagation, it should call e.stopPropagation()
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flipping-card-container ${className}`}
      onClick={handleToggleFlip}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`flipping-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flipping-card-front">
          {frontContent}
        </div>
        <div className="flipping-card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
}
