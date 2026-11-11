import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
  href?: string
  size?: number
  showWordmark?: boolean
  wordmark?: string
  inverted?: boolean
  className?: string
}

export function BrandLogo ({
  href = '/',
  size = 40,
  showWordmark = false,
  wordmark = 'dostel',
  inverted = false,
  className = '',
}: BrandLogoProps) {
  const mark = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="Dostel"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        priority
      />
      {showWordmark && (
        <span className="hidden leading-none sm:block">
          <span
            className={`block text-xl font-extrabold tracking-[-0.03em] ${
              inverted ? 'text-white' : 'text-ink-1000'
            }`}
          >
            {wordmark}
          </span>
          <span
            className={`block text-[0.6875rem] ${
              inverted ? 'text-white/45' : 'text-ink-500'
            }`}
            style={{ fontFamily: 'var(--font-deva)' }}
          >
            दोस्त + hostel
          </span>
        </span>
      )}
    </span>
  )

  if (!href) return mark

  return (
    <Link href={href} className="flex shrink-0 items-center" aria-label="Dostel home">
      {mark}
    </Link>
  )
}
