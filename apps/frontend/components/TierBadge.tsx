'use client';

import { useEffect, useState } from 'react';

export type Tier = 'bronze' | 'silver' | 'gold' | null;

export interface TierBadgeProps {
  tier: Tier;
  points?: number;
  maxPoints?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

function getTierColors(tier: Tier) {
  switch (tier) {
    case 'bronze':
      return {
        border: 'var(--ds-color-bronze)',
        background: 'var(--ds-color-bronze)/10',
        color: 'var(--ds-color-bronze)',
      };
    case 'silver':
      return {
        border: 'var(--ds-color-silver)',
        background: 'var(--ds-color-silver)/10',
        color: 'var(--ds-color-silver)',
      };
    case 'gold':
      return {
        border: 'var(--ds-color-gold)',
        background: 'var(--ds-color-gold)/10',
        color: 'var(--ds-color-gold)',
      };
    default:
      return {
        border: 'var(--ds-color-stone-200)',
        background: 'transparent',
        color: 'var(--ds-color-stone-600)',
      };
  }
}

export default function TierBadge({ tier, points, maxPoints, size = 'md', className = '', onClick }: TierBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { border, background, color } = getTierColors(tier);

  // Determine size
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'h-8 w-8'; // 32x32
      break;
    case 'md':
      sizeClass = 'h-10 w-10'; // 40x40
      break;
    case 'lg':
      sizeClass = 'h-12 w-12'; // 48x48
      break;
    default:
      sizeClass = 'h-10 w-10';
  }

  // Points text
  const pointsText = points !== undefined ? `${points}pts` : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={
        tier === null
          ? 'No Dosteller tier'
          : `${tier} Dosteller tier${points !== undefined ? `, ${points} Dosteller points` : ''}`
      }
      className={`tier-badge inline-flex items-center justify-center ${sizeClass} rounded-full border transition-all duration-150 ${border} bg-[${background}] text-[${color}] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ds-color-sky)] active:scale-95 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onDragLeave={() => setPressed(false)}
    >
      {tier !== null && (
        <>
          {tier === 'bronze' && (
            <span className="text-xs font-medium">Bronze</span>
          )}
          {tier === 'silver' && (
            <span className="text-xs font-medium">Silver</span>
          )}
          {tier === 'gold' && (
            <span className="text-xs font-medium">Gold</span>
          )}
        </>
      )}
      {pointsText && (
        <span className="mt-1 text-xs font-medium text-[var(--ds-color-stone-600)]">{pointsText}</span>
      )}
      <style jsx>{`
        .tier-badge {
          transition: transform var(--ds-motion-fast) var(--ds-ease-in-out), box-shadow var(--ds-motion-fast) var(--ds-ease-in-out);
        }
        .tier-badge:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: var(--ds-shadow-sm);
        }
        .tier-badge:active:not(:disabled) {
          transform: scale(0.98);
        }
        @media (prefers-reduced-motion: reduce) {
          .tier-badge {
            transition: none;
          }
          .tier-badge:hover:not(:disabled),
          .tier-badge:active:not(:disabled) {
            transform: none;
          }
        }
      `}</style>
    </button>
  );
}