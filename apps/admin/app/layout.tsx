/* Callers: Next.js root layout for all admin routes. Loads Dostel fonts via
   next/font (globals.css cannot @import Google fonts after @import tailwindcss).
   Wraps GraphQLProvider + AuthGate. No secrets in this file.
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthGate from '../components/AuthGate'
import GraphQLProvider from './graphqlProvider'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const plex = IBM_Plex_Sans({
  variable: '--font-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata = {
  title: 'Dostel Admin',
  description: 'Property operations board for Dostel',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${plex.variable} ${jetbrains.variable}`}>
        <GraphQLProvider>
          <AuthGate>{children}</AuthGate>
        </GraphQLProvider>
      </body>
    </html>
  )
}
