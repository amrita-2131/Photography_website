import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

function TestimonialCard({ handleShuffle, testimonial, position, author, role, image }) {
  const dragRef = useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
        position: 'absolute',
        left: 0,
        top: 0,
        width: 350,
        height: 450,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        userSelect: 'none',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(212,194,199,0.3)',
        boxShadow: '0 10px 40px -10px rgba(129,79,102,0.15)',
        cursor: isFront ? 'grab' : 'auto',
      }}
      whileTap={isFront ? { cursor: 'grabbing' } : {}}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
        opacity: position === "front" ? 1 : position === "middle" ? 0.8 : 0.5,
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e) => {
        dragRef.current = e.clientX || (e.touches && e.touches[0].clientX);
      }}
      onDragEnd={(e) => {
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        if (dragRef.current && clientX && (dragRef.current - clientX > 100 || clientX - dragRef.current > 100)) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
    >
      {image ? (
        <img referrerPolicy="no-referrer"
          src={image}
          alt={`Avatar of ${author}`}
          style={{
            pointerEvents: 'none',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #fff',
            boxShadow: '0 4px 12px rgba(129,79,102,0.1)',
            marginBottom: '24px'
          }}
        />
      ) : (
        <div style={{ width: '120px', height: '120px', marginBottom: '24px' }} />
      )}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[...Array(5)].map((_, j) => (
          <span key={j} className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-primary-container)', fontSize: 18 }}>star</span>
        ))}
      </div>
      <p style={{
        textAlign: 'center',
        fontStyle: 'italic',
        color: 'var(--color-on-surface-variant)',
        fontSize: '14px',
        lineHeight: 1.6,
        marginBottom: '24px'
      }}>
        {testimonial}
      </p>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{
          color: 'var(--color-on-surface)',
          fontFamily: 'var(--font-serif)',
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '4px'
        }}>
          {author}
        </h4>
        <span style={{
          color: 'var(--color-outline)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {role}
        </span>
      </div>
    </motion.div>
  );
}

export default function TestimonialShuffle({ testimonials }) {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    setPositions((prev) => {
      const newPositions = [...prev];
      newPositions.unshift(newPositions.pop());
      return newPositions;
    });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
      padding: '40px 24px',
      minHeight: '600px' // Give room for cards to spread
    }}>
      <div style={{
        position: 'relative',
        width: '350px',
        height: '450px',
        marginLeft: '-100px', // Matches demo: offset to center the spread group
      }} className="shuffle-container">
        <style>{`
          @media (min-width: 768px) {
            .shuffle-container { margin-left: -175px !important; }
          }
        `}</style>
        {testimonials.map((t, index) => (
          <TestimonialCard
            key={t.id || index}
            testimonial={t.quote}
            author={t.name}
            role={t.session}
            image={t.image}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  );
}
