/* Callers: Next.js serves this at /design (dostellers.com/design via nginx).
   Footer.tsx will link here. No apps/frontend/app/design/* exists today.
   Schema: none — static metadata + DesignSystemClient render.
   User: "Build a design system for dostel at dosteller.com/design" */

import type { Metadata } from 'next'
import DesignSystemClient from './DesignSystemClient'

export const metadata: Metadata = {
  title: 'Dostel Design System — Noticeboard v2.2',
  description:
    'Living design system for Dostel: Noticeboard DNA, Astryx-informed Action/Field patterns, semantic tokens, verified contrast, and voice rules.',
  openGraph: {
    title: 'Dostel Design System',
    description: 'Ink primary. Coral accent. Yellow is a tag. Proof over claims.',
  },
}

export default function DesignSystemPage () {
  return <DesignSystemClient />
}
