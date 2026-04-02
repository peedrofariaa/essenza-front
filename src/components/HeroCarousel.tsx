/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export type Slide = {
  imageSrc?: string
  imageAlt?: string
  title: string
  titleStack?: boolean
  subtitle?: string
  ctaLabel?: string
  ctaAction?: (() => void) | string
  overlayClassName?: string
  align?: 'left' | 'center' | 'right'
  ctaClassName?: string
}

type HeroCarouselProps = {
  slides: Slide[]
  autoPlayInterval?: number
  aspectMobile?: string
  aspectDesktop?: string
}

const alignMap = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
}

export default function HeroCarousel({
  slides,
  autoPlayInterval = 5000,
  aspectMobile = 'aspect-[16/9]',
  aspectDesktop = 'aspect-[21/9]',
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback(
    (index: number) => setCurrent((index + slides.length) % slides.length),
    [slides.length],
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, autoPlayInterval)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, paused, next, autoPlayInterval])

  const handleCta = (action?: (() => void) | string) => {
    if (!action) return
    typeof action === 'string' ? navigate(action) : action()
  }

  const slide = slides[current]
  const alignment = alignMap[slide.align ?? 'left']

  return (
    <section
      className="relative pt-[112px] select-none sm:pt-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`relative w-full overflow-hidden bg-gray-100 ${aspectMobile} sm:${aspectDesktop}`}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            {s.imageSrc ? (
              <img
                src={s.imageSrc}
                alt={s.imageAlt || s.title}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#f3f4f6] to-[#e5e7eb]">
                <span className="text-gray-500">Banner</span>
              </div>
            )}
            <div
              className={`absolute inset-0 ${s.overlayClassName ?? 'bg-black/30'}`}
            />
          </div>
        ))}

        <div className="absolute inset-0 z-20 px-6">
          <div
            className={`mx-auto flex h-full max-w-6xl items-center ${alignment}`}
          >
            <div className="max-w-2xl text-white">
              {slide.titleStack ? (
                <h1 className="flex flex-col text-3xl leading-tight font-light md:text-4xl">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i}>{word}</span>
                  ))}
                </h1>
              ) : (
                <h1 className="text-3xl font-light md:text-4xl">
                  {slide.title}
                </h1>
              )}

              {slide.subtitle && (
                <p className="mt-3 text-white/90">{slide.subtitle}</p>
              )}
              {slide.ctaLabel && (
                <div className="mt-6">
                  <button
                    onClick={() => handleCta(slide.ctaAction)}
                    className={`cursor-pointer rounded-md px-5 py-3 text-white transition hover:brightness-110 ${
                      slide.ctaClassName ?? 'bg-[#00843d]'
                    }`}
                  >
                    {slide.ctaLabel}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          className="absolute top-1/2 left-3 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
          aria-label="Slide anterior"
        >
          <FiChevronLeft size={22} />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-3 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
          aria-label="Próximo slide"
        >
          <FiChevronRight size={22} />
        </button>

        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
