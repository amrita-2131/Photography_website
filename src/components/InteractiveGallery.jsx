import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import './InteractiveGallery.css';

// Container animation variants
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Photo animation variants
const photoVariants = {
  hidden: () => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.8,
    opacity: 0,
  }),
  visible: (custom) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.15,
    },
  }),
};

function getRandomNumberInRange(min, max) {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

const PhotoCard = ({ image, custom, zIndex }) => {
  const [rotation, setRotation] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    // Determine random rotation like the reference: 1 to 4 degrees, depending on direction
    const randomRotation = getRandomNumberInRange(1, 4) * (custom.direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [custom.direction]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="interactive-card-wrapper"
      style={{ zIndex }}
      variants={photoVariants}
      custom={custom}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.1, zIndex: 999 }}
      whileHover={{
        scale: 1.05,
        rotateZ: 2 * (custom.direction === "left" ? -1 : 1),
        zIndex: 999,
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 999,
      }}
      initial="hidden"
      // Merge the visible state animations with our custom rotation
      animate={{ ...photoVariants.visible(custom), rotate: rotation }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
    >
      <div className="interactive-polaroid-card">
        <img referrerPolicy="no-referrer"
          src={image.src}
          alt={image.alt || image.tag}
          className="interactive-polaroid-image"
          draggable={false}
        />
        <div className="interactive-polaroid-caption">
          {image.tag}
        </div>
      </div>
    </motion.div>
  );
};

const InteractiveGallery = ({ images = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [layoutPhotos, setLayoutPhotos] = useState([]);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const animationTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  useEffect(() => {
    // Calculate layout spread dynamically to handle window size
    const calculateLayout = () => {
      const isMobile = window.innerWidth < 768;
      const spreadFactor = isMobile ? 0.35 : 1; 

      const layouts = images.map((image, index) => {
        // Calculate a nice arch or fan shape
        const offsetIndex = index - (images.length - 1) / 2; // e.g., -2.5, -1.5, ...
        const xPos = offsetIndex * 130 * spreadFactor; // spacing
        const yPos = Math.abs(offsetIndex) * 20 * spreadFactor; // Drop down on the edges
        
        const direction = offsetIndex < 0 ? "left" : "right";
        
        // Z-index: Make the center items highest or stack neatly left-to-right
        // Here we give higher z-index to lower index to match the reference behavior cleanly
        const zIndex = 50 - index; 

        return {
          ...image,
          custom: {
            x: `${xPos}px`,
            y: `${yPos}px`,
            order: index,
            direction: direction,
          },
          zIndex: zIndex,
        };
      });
      setLayoutPhotos(layouts);
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [images]);

  return (
    <div className="interactive-gallery-container">
      <motion.div
        className="interactive-gallery-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="interactive-gallery-inner"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {layoutPhotos.map((photo) => (
            <PhotoCard
              key={photo.src}
              image={photo}
              custom={photo.custom}
              zIndex={photo.zIndex}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveGallery;
