import type { Config } from 'tailwindcss'

// Tailwind v4 uses CSS-first tokens in app/globals.css (@theme inline).
// This config exists for tooling/agents that expect a tailwind.config file.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config
