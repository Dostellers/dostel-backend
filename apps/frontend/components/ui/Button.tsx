'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Action button — Astryx Button variant model, Dostel Noticeboard tokens.
 * Variants: primary (ink), secondary, ghost, accent (yellow tag), destructive.
 * Coral reserved for hover on primary — not a permanent flood.
 * Callers: DesignSystemClient Action/Components sections.
 * User: "lets learn and improve our design system" (from Meta Astryx).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-surface-inverse)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]',
  secondary:
    'border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] hover:bg-ink-50',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] hover:bg-ink-100',
  accent:
    'bg-[var(--color-tag-fill)] text-[var(--color-text-primary)] hover:bg-yellow-200',
  destructive:
    'bg-[var(--color-negative)] text-white hover:brightness-110',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 min-h-[44px] px-5 text-sm',
  lg: 'h-12 px-7 text-sm',
}

export default function Button ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'btn-press inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-45',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
