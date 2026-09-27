import { motion, useScroll, useTransform } from 'motion/react'
import type { ReactNode, RefObject } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, y = 30, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Заголовок раздела в духе каталожной карточки: римский номер, моно-подпись, крупная антиква.
 * Строки выезжают из-под маски; видимость отслеживает сам заголовок, а не спрятанные строки.
 */
export function Chapter({ roman, label, title, className = '', dark = false }: { roman: string; label: string; title: ReactNode[]; className?: string; dark?: boolean }) {
  return (
    <div className={className}>
      <Reveal className={`flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.25em] ${dark ? 'text-page/60' : 'text-umber'}`}>
        <span className={`font-display text-lg normal-case tracking-normal ${dark ? 'text-ochre' : 'text-wax'}`}>{roman}.</span>
        <span className={`h-px w-12 ${dark ? 'bg-page/30' : 'bg-umber/40'}`} />
        {label}
      </Reveal>
      <motion.h2
        className="mt-5 font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.02] tracking-[-0.01em]"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '-8% 0px' }}
      >
        {title.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }} transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  )
}

export function Ticker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`edge-fade flex overflow-hidden ${className}`}>
      <div className="flex w-max shrink-0 animate-marquee">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/** Прогресс прокрутки, всегда считаемый в JS (без браузерного ScrollTimeline — он расходится с Lenis) */
export function useSectionProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}

/** Сургучная печать — круг с неровным краем и оттиском */
export function WaxSeal({ text = '№7', className = 'h-16 w-16' }: { text?: string; className?: string }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    const r = 46 + (i % 3 === 0 ? 3 : i % 2 ? -1.5 : 1.5)
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%">
          <stop offset="0" stopColor="#9c3441" />
          <stop offset="0.7" stopColor="#6b1e2a" />
          <stop offset="1" stopColor="#4a121c" />
        </radialGradient>
      </defs>
      <polygon points={pts} fill="url(#wax)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#3d0f17" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#c0606b" strokeOpacity="0.35" strokeWidth="1" />
      <text x="50" y="59" textAnchor="middle" fontFamily="Prata, Georgia, serif" fontSize="26" fill="#3d0f17" fillOpacity="0.75">
        {text}
      </text>
    </svg>
  )
}

/** Кнопка-этикетка */
export function Btn({ children, onClick, href, variant = 'wax', className = '' }: { children: ReactNode; onClick?: () => void; href?: string; variant?: 'wax' | 'line'; className?: string }) {
  const cls = `group relative inline-flex items-center gap-3 overflow-hidden px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-500 ${
    variant === 'wax' ? 'bg-wax text-page hover:bg-sepia' : 'border border-sepia text-sepia hover:bg-sepia hover:text-page'
  } ${className}`
  const inner = (
    <>
      {children}
      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </>
  )
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
