import React, { useRef, type ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  backdropColor?: string;
}

const GLOW_HUE: Record<string, number> = {
  blue: 229, purple: 270, green: 140, red: 340, orange: 40,
};

const sizeMap = { sm: 'w-48 h-64', md: 'w-64 h-80', lg: 'w-80 h-96' };

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  backdropColor,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hue = GLOW_HUE[glowColor] ?? 229;

  function handlePointerMove(e: React.PointerEvent) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    card.style.setProperty('--glow-opacity', '1');
  }

  function handlePointerLeave() {
    cardRef.current?.style.setProperty('--glow-opacity', '0');
  }

  const sizeClasses = customSize ? '' : sizeMap[size];
  const bg = backdropColor ?? 'hsl(0 0% 60% / 0.12)';

  const style: React.CSSProperties & Record<string, string | number> = {
    '--glow-hue': hue,
    backgroundColor: bg,
    contentVisibility: 'auto',
    containIntrinsicSize: '0 300px',
  };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={cardRef}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`
        glow-card
        ${sizeClasses}
        ${!customSize ? 'aspect-[3/4]' : ''}
        rounded-2xl relative flex flex-col p-4 gap-4 overflow-hidden
        border-[2px] border-white/[0.08] shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export { GlowCard };
