import { useEffect, useRef } from 'react';

interface RainAnimationProps {
  className?: string;
}

export function RainAnimation({ className = "" }: RainAnimationProps) {
  const rainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = rainRef.current;
    if (!container) return;

    // Clear any existing drops
    container.innerHTML = '';

    const drops = 50;
    for (let i = 0; i < drops; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 1.8 + Math.random() * 1.8;
      const height = 10 + Math.random() * 18;
      
      drop.style.left = left + '%';
      drop.style.animationDelay = delay + 's';
      drop.style.animationDuration = duration + 's';
      drop.style.height = height + 'px';
      
      container.appendChild(drop);
    }
  }, []);

  return (
    <div 
      ref={rainRef}
      className={`rain-container ${className}`}
      aria-hidden="true"
    />
  );
}