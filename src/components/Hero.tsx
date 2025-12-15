type HeroProps = {
  imageSrc?: string
  imageAlt?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  onHeroClick?: () => void
  aspectDesktop?: string
  aspectMobile?: string
  overlayClassName?: string
  centered?: boolean
}

export default function Hero({
  imageSrc,
  imageAlt = '',
  title,
  subtitle,
  ctaLabel,
  onHeroClick,
  aspectDesktop = 'aspect-[21/9]',
  aspectMobile = 'aspect-[16/9]',
  overlayClassName = 'bg-black/30',
  centered = true,
}: HeroProps) {
  return (
    <section
      className="relative cursor-pointer"
      onClick={onHeroClick}
      role="button"
      aria-label="Descobrir a coleção"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onHeroClick?.()
      }}
    >
      <div
        className={`relative w-full overflow-hidden bg-gray-100 ${aspectMobile} sm:${aspectDesktop}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb]">
            <span className="text-gray-500">Banner</span>
          </div>
        )}

        <div className={`absolute inset-0 ${overlayClassName}`} />

        <div className="absolute inset-0 px-6">
          <div
            className={`mx-auto flex h-full max-w-6xl items-center ${
              centered
                ? 'justify-center text-center'
                : 'justify-start text-left'
            }`}
          >
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-3 text-white/90">{subtitle}</p>}
              {ctaLabel && onHeroClick && (
                <div className="mt-6">
                  <button className="cursor-pointer rounded-md bg-[#c9a227] px-5 py-3 text-white transition hover:brightness-110">
                    {ctaLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
