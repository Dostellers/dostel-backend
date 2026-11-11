'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { HeroVideoClip } from '@/lib/hero-videos'

/**
 * Hostelworld-style hero with a live video plane (always mounted when clips exist).
 * Callers: app/page.tsx. User: "brong videos" / bring videos.
 */

type Props = {
  stamp: string
  title: string
  subtitle: string
  imageUrl: string
  imageAlt?: string
  videos?: HeroVideoClip[]
  children?: ReactNode
}

export default function LandingHero ({
  stamp,
  title,
  subtitle,
  imageUrl,
  imageAlt = '',
  videos = [],
  children,
}: Props) {
  const [ready, setReady] = useState(false)
  const [clipIndex, setClipIndex] = useState(0)
  const [failed, setFailed] = useState<Record<string, true>>({})
  const [reducedMotion, setReducedMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const clips = videos.filter((v) => v.src && !failed[v.src])
  const active = clips.length ? clips[clipIndex % clips.length] : null
  const showVideo = Boolean(active) && !reducedMotion

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener?.('change', onChange)
    const id = requestAnimationFrame(() => setReady(true))
    return () => {
      mq.removeEventListener?.('change', onChange)
      cancelAnimationFrame(id)
    }
  }, [])

  useEffect(() => {
    if (!showVideo || !active) return
    const el = videoRef.current
    if (!el) return

    const tryPlay = () => {
      el.muted = true
      el.setAttribute('muted', '')
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Retry once after a tick — first paint sometimes races autoplay.
          window.setTimeout(() => {
            el.muted = true
            el.play().catch(() => {})
          }, 120)
        })
      }
    }

    tryPlay()
    el.addEventListener('loadeddata', tryPlay)
    return () => el.removeEventListener('loadeddata', tryPlay)
  }, [showVideo, active?.src, clipIndex])

  // Rotate clips on a timer so short files and browsers that ignore ended still cycle.
  useEffect(() => {
    if (!showVideo || clips.length < 2) return
    const timer = window.setInterval(() => {
      setClipIndex((i) => (i + 1) % clips.length)
    }, 9000)
    return () => window.clearInterval(timer)
  }, [showVideo, clips.length])

  const words = title.trim().split(/\s+/).filter(Boolean)
  const stampHasDost = stamp.includes('दोस्त')

  return (
    <section className="landing-hero bg-paper pb-6 pt-4 sm:pb-10 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            className={`landing-hero__frame relative isolate overflow-hidden rounded-2xl bg-ink-1000 text-white shadow-[0_24px_60px_-36px_rgba(11,11,12,0.55)] ${ready ? 'is-ready' : ''}`}
          >
            <div className="landing-hero__media absolute inset-0 overflow-hidden" aria-hidden={!imageAlt}>
              {/* Still always underneath as poster/fallback */}
              <div
                className="landing-hero__photo absolute inset-0 bg-ink-900 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
                role={imageAlt ? 'img' : 'presentation'}
                aria-label={imageAlt || undefined}
              />

              {showVideo && active ? (
                <video
                  key={active.src}
                  ref={videoRef}
                  className="landing-hero__video absolute inset-0 h-full w-full object-cover"
                  src={active.src}
                  poster={active.poster || imageUrl}
                  muted
                  playsInline
                  autoPlay
                  loop={clips.length < 2}
                  preload="auto"
                  onEnded={() => {
                    if (clips.length > 1) setClipIndex((i) => (i + 1) % clips.length)
                  }}
                  onError={() => {
                    setFailed((prev) => ({ ...prev, [active.src]: true }))
                    setClipIndex(0)
                  }}
                />
              ) : null}

              <div className="landing-hero__veil absolute inset-0" />
              <div className="landing-hero__grain absolute inset-0" aria-hidden />
            </div>

            <div className="relative flex min-h-[min(62vh,34rem)] flex-col justify-end px-5 pb-24 pt-12 sm:min-h-[min(58vh,36rem)] sm:px-10 sm:pb-28 sm:pt-16 lg:px-12">
              <div className={`landing-hero__copy max-w-2xl ${ready ? 'is-ready' : ''}`}>
                <span className="stamp border-white/40 bg-white/10 text-white backdrop-blur-sm">
                  {stampHasDost ? (
                    <>
                      <span style={{ fontFamily: 'var(--font-deva)' }}>दोस्त</span>
                      {stamp.replace('दोस्त', '')}
                    </>
                  ) : (
                    stamp
                  )}
                </span>

                <h1 className="mt-5 text-balance text-[2.6rem] leading-[0.94] tracking-[-0.035em] text-white sm:text-5xl lg:text-[4rem]">
                  {words.map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="landing-hero__word inline-block"
                      style={{ '--word-i': i } as CSSProperties}
                    >
                      {word}
                      {i < words.length - 1 ? '\u00A0' : ''}
                    </span>
                  ))}
                </h1>

                <p className="landing-hero__sub mt-4 max-w-lg text-pretty text-base font-medium leading-7 text-white/82 sm:text-lg sm:leading-8">
                  {subtitle}
                </p>
              </div>

              {showVideo && clips.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-1.5" aria-label="Hero film reel">
                  {clips.map((clip, i) => (
                    <button
                      key={clip.src}
                      type="button"
                      onClick={() => setClipIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === (clipIndex % clips.length) ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Play ${clip.label}`}
                      aria-current={i === (clipIndex % clips.length) ? 'true' : undefined}
                    />
                  ))}
                  {active ? (
                    <span className="data ml-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-white/55">
                      {active.label}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {children ? (
            <div className={`landing-hero__search relative z-30 mx-auto -mt-14 max-w-4xl px-3 sm:-mt-16 sm:px-6 ${ready ? 'is-ready' : ''}`}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
