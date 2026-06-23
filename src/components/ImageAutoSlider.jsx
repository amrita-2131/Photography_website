import React from 'react';
import './ImageAutoSlider.css';

export default function ImageAutoSlider({ images = [] }) {
  if (!images || images.length === 0) return null;

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full relative overflow-hidden flex items-center justify-center py-12 md:py-20 bg-[var(--color-surface)]">
      
      {/* Top Gradient Overlay to blend naturally */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[var(--color-surface)] to-transparent z-20 pointer-events-none" />

      {/* Scrolling images container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="scroll-container-mask w-full max-w-[1400px]">
          <div className="infinite-scroll flex gap-4 md:gap-6 w-max">
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="auto-slider-image flex-shrink-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(200,142,167,0.06)]"
              >
                <img
                  src={image}
                  alt={`Gallery showcase ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent z-20 pointer-events-none" />
    </div>
  );
}
