'use client';

import { useState, useEffect, useRef } from 'react';

interface FloatingText {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  size: number;
  rotation: number;
  opacity: number;
  age: number;
}

const TSFM_VARIANTS = [
'TSFM', 'tsfm', 'toronto', 'attention', 'decode', 'prefill', 'spec','infer', 'gqa', 'mqa', 'rl', 'distributed', 'kv'
];

export default function FloatingTSFM() {
  const [texts, setTexts] = useState<FloatingText[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRandomText = (id: string): FloatingText => {
    return {
      id,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      text: TSFM_VARIANTS[Math.floor(Math.random() * TSFM_VARIANTS.length)],
      size: Math.random() * 30 + 25,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.4 + 0.6,
      age: 0
    };
  };

  // Initialize texts
  useEffect(() => {
    const initialTexts: FloatingText[] = [];
    const textCount = 15;
    
    for (let i = 0; i < textCount; i++) {
      initialTexts.push(createRandomText(`text-${i}`));
    }
    
    setTexts(initialTexts);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTexts(prevTexts => {
        return prevTexts.map(text => {
          let newX = text.x + text.vx;
          let newY = text.y + text.vy;
          let newVx = text.vx;
          let newVy = text.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          // Remove stochastic movement for linear motion
          // No random velocity changes

          // Limit velocity
          const maxSpeed = 3;
          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > maxSpeed) {
            newVx = (newVx / speed) * maxSpeed;
            newVy = (newVy / speed) * maxSpeed;
          }

          // Keep rotation static for linear movement
          const newRotation = text.rotation;

          // Update age and fade out old texts
          const newAge = text.age + 16;
          const newOpacity = Math.max(0.1, text.opacity - (newAge > 30000 ? 0.001 : 0));

          return {
            ...text,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            opacity: newOpacity,
            age: newAge
          };
        }).filter(text => text.opacity > 0.1);
      });
    };

    const interval = setInterval(animate, 33); // ~30fps for good balance
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked text
    const clickedText = texts.find(text => {
      const distance = Math.sqrt(Math.pow(x - text.x, 2) + Math.pow(y - text.y, 2));
      return distance <= text.size;
    });
    
    if (clickedText) {
      // Create two new texts near the clicked one
      const newTexts = [
        createRandomText(`text-${Date.now()}-1`),
        createRandomText(`text-${Date.now()}-2`)
      ];
      
      // Position them near the clicked text
      newTexts.forEach((newText) => {
        newText.x = clickedText.x + (Math.random() - 0.5) * 100;
        newText.y = clickedText.y + (Math.random() - 0.5) * 100;
        newText.vx = (Math.random() - 0.5) * 4;
        newText.vy = (Math.random() - 0.5) * 4;
        newText.opacity = 0.8;
      });
      
      setTexts(prevTexts => [...prevTexts, ...newTexts]);
    } else {
      // Clicked on empty space, create a new text at click position
      const newText = createRandomText(`text-${Date.now()}`);
      newText.x = x;
      newText.y = y;
      newText.vx = (Math.random() - 0.5) * 4;
      newText.vy = (Math.random() - 0.5) * 4;
      newText.opacity = 0.8;
      
      setTexts(prevTexts => [...prevTexts, newText]);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="fixed inset-0 w-full h-full pointer-events-auto cursor-pointer"
      style={{ zIndex: 1 }}
    >
      {texts.map(text => (
        <div
          key={text.id}
          style={{
            position: 'absolute',
            left: text.x,
            top: text.y,
            fontSize: `${text.size}px`,
            opacity: text.opacity,
            transform: `rotate(${text.rotation}deg)`,
            pointerEvents: 'none',
            userSelect: 'none',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            willChange: 'transform',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}
        >
          {text.text}
        </div>
      ))}
    </div>
  );
}
