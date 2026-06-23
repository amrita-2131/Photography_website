import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import './CircularPortfolio.css';

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CircularPortfolio({
  highlights = [],
  autoplay = true,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const highlightsLength = useMemo(() => highlights.length, [highlights]);
  const activeHighlight = useMemo(
    () => highlights[activeIndex],
    [activeIndex, highlights]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay && highlightsLength > 0) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % highlightsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, highlightsLength]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, highlightsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % highlightsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [highlightsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + highlightsLength) % highlightsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [highlightsLength]);

  if (!highlights || highlights.length === 0) return null;

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + highlightsLength) % highlightsLength === index;
    const isRight = (activeIndex + 1) % highlightsLength === index;
    
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-grid">
        <div className="image-container" ref={imageContainerRef}>
          {highlights.map((item, index) => (
            <img
              key={index}
              src={item.src}
              alt={item.title}
              className="portfolio-image"
              style={getImageStyle(index)}
            />
          ))}
        </div>
        
        <div className="portfolio-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="portfolio-title">{activeHighlight.title}</h3>
              <p className="portfolio-category">{activeHighlight.category}</p>
              
              <motion.p className="portfolio-desc">
                {activeHighlight.description.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(5px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut", delay: 0.015 * i }}
                    style={{ display: "inline-block", marginRight: "0.25rem" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          
          <div className="arrow-buttons">
            <button className="arrow-button prev-button" onClick={handlePrev} aria-label="Previous image">
              <FaArrowLeft size={16} />
            </button>
            <button className="arrow-button next-button" onClick={handleNext} aria-label="Next image">
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
