import { useEffect, useRef } from 'react';

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    // Small delay to let DOM settle, then observe
    const timer = setTimeout(() => {
      const elements = el.querySelectorAll('.reveal');
      elements.forEach((elem) => observer.observe(elem));
      if (el.classList.contains('reveal')) observer.observe(el);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return ref;
}
