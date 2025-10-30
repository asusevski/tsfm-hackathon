'use client';

import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent
} from 'react';

interface FloatingText {
  id: string;
  xPercent: number;
  yPercent: number;
  text: string;
  size: number;
  rotation: number;
  opacity: number;
  duration: number;
  delay: number;
  floatX: number;
  floatY: number;
}

const TSFM_VARIANTS = [
  'TSFM',
  'tsfm',
  'toronto',
  'attention',
  'decode',
  'prefill',
  'spec',
  'infer',
  'gqa',
  'mqa',
  'rl',
  'distributed',
  'kv'
];

const INITIAL_TEXT_COUNT = 15;
const MAX_TEXT_COUNT = 40;

const createRandomText = (
  id: string,
  overrides: Partial<Pick<FloatingText, 'xPercent' | 'yPercent'>> = {}
): FloatingText => {
  const floatDistance = 20 + Math.random() * 40;
  const floatAngle = Math.random() * Math.PI * 2;

  return {
    id,
    xPercent: overrides.xPercent ?? Math.random() * 80 + 10,
    yPercent: overrides.yPercent ?? Math.random() * 80 + 10,
    text: TSFM_VARIANTS[Math.floor(Math.random() * TSFM_VARIANTS.length)],
    size: Math.random() * 24 + 20,
    rotation: Math.random() * 40 - 20,
    opacity: Math.random() * 0.4 + 0.6,
    duration: Math.random() * 12 + 18,
    delay: Math.random() * 6,
    floatX: Math.cos(floatAngle) * floatDistance,
    floatY: Math.sin(floatAngle) * floatDistance
  };
};

export default function FloatingTSFM() {
  const [texts, setTexts] = useState<FloatingText[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialTexts = Array.from(
      { length: INITIAL_TEXT_COUNT },
      (_, index) => createRandomText(`text-${index}`)
    );
    setTexts(initialTexts);
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xPercent = Math.min(
      95,
      Math.max(5, ((event.clientX - rect.left) / rect.width) * 100)
    );
    const yPercent = Math.min(
      95,
      Math.max(5, ((event.clientY - rect.top) / rect.height) * 100)
    );

    setTexts(prevTexts => {
      const nextTexts = [
        ...prevTexts,
        createRandomText(`text-${Date.now()}`, { xPercent, yPercent })
      ];
      return nextTexts.length > MAX_TEXT_COUNT
        ? nextTexts.slice(nextTexts.length - MAX_TEXT_COUNT)
        : nextTexts;
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="floating-field"
      style={{ zIndex: 1 }}
    >
      {texts.map(text => {
        const wrapperStyle: CSSProperties = {
          left: `${text.xPercent}%`,
          top: `${text.yPercent}%`,
          opacity: text.opacity
        };

        const contentStyle: CSSProperties & {
          '--float-x': string;
          '--float-y': string;
          '--rotation': string;
        } = {
          fontSize: `${text.size}px`,
          animationDuration: `${text.duration}s`,
          animationDelay: `${text.delay}s`,
          '--float-x': `${text.floatX}px`,
          '--float-y': `${text.floatY}px`,
          '--rotation': `${text.rotation}deg`
        };

        return (
          <div key={text.id} className="floating-text" style={wrapperStyle}>
            <span className="floating-text-content" style={contentStyle}>
              {text.text}
            </span>
          </div>
        );
      })}

      <style jsx>{`
        .floating-field {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: auto;
          cursor: pointer;
        }

        .floating-text {
          position: absolute;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .floating-text-content {
          display: inline-block;
          color: white;
          font-weight: bold;
          font-family: monospace;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          will-change: transform;
          user-select: none;
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          pointer-events: none;
        }

        @keyframes float {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--rotation));
          }
          100% {
            transform: translate3d(var(--float-x), var(--float-y), 0)
              rotate(var(--rotation));
          }
        }
      `}</style>
    </div>
  );
}
