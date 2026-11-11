/**
 * Free royalty-free hero clips for the guest landing hero.
 * Sources: Pexels License (https://www.pexels.com/license/) — free for commercial use.
 * Hosted under /public/videos/hero so the hero does not depend on hotlinks.
 *
 * Callers: components/LandingHero.tsx (videoSrcs), app/page.tsx passes HERO_VIDEO_CLIPS.
 * No other catalog file lists hero video URLs.
 * User: "the hero can be video clips search and put free resources of hotels in india and its videos"
 */

export type HeroVideoClip = {
  src: string
  poster?: string
  label: string
  credit: string
  sourceUrl: string
}

/** Landscape clips that read as Indian hostel / travel atmosphere. */
export const HERO_VIDEO_CLIPS: HeroVideoClip[] = [
  {
    src: '/videos/hero/resort-coast.mp4',
    label: 'Coast resort morning',
    credit: 'Pexels',
    sourceUrl: 'https://www.pexels.com/video/3571264/',
  },
  {
    src: '/videos/hero/tropical-resort.mp4',
    label: 'Tropical stay',
    credit: 'Pexels',
    sourceUrl: 'https://www.pexels.com/video/3045163/',
  },
  {
    src: '/videos/hero/beach-aerial.mp4',
    label: 'Beach aerial',
    credit: 'Pexels',
    sourceUrl: 'https://www.pexels.com/video/1409899/',
  },
  {
    src: '/videos/hero/hotel-lobby-view.mp4',
    label: 'Lobby light',
    credit: 'Pexels',
    sourceUrl: 'https://www.pexels.com/video/5377684/',
  },
  {
    src: '/videos/hero/travel-india-street.mp4',
    label: 'India street pulse',
    credit: 'Pexels',
    sourceUrl: 'https://www.pexels.com/video/855570/',
  },
]
