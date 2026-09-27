import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { useCart } from '../state/cart'
import { WaxSeal } from './ui'

const LINKS = [
  { href: '#atlas', r: 'I', label: 'Атлас' },
  { href: '#message', r: 'II', label: 'Послание' },
  { href: '#album', r: 'III', label: 'Альбом' },
  { href: '#card', r: 'IV', label: 'Открытка' },
  { href: '#delivery', r: 'V', label: 'Доставка' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { count, setOpen, pulse } = useCart()
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 30))

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'border-b border-sepia/15 bg-page/90 backdrop-blur-md' : ''}`}>
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Гербарий №7 — на главную">
            <WaxSeal className="h-10 w-10" />
            <span className="leading-none">
              <span className="block font-display text-xl">Гербарий</span>
              <span className="hidden font-mono text-[0.58rem] uppercase tracking-[0.3em] text-umber sm:inline">мастерская №7</span>
            </span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group flex items-baseline gap-1.5 text-sm">
                  <span className="font-display text-xs text-wax">{l.r}.</span>
                  <span className="relative">
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sepia transition-transform duration-500 group-hover:scale-x-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 border border-sepia px-3 py-2.5 font-mono sm:gap-3 sm:px-4 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-sepia hover:text-page">
              <Envelope />
              <span className="hidden sm:inline">Конверт</span>
              <motion.span key={pulse} initial={{ scale: 1.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }} className="grid h-5 min-w-5 place-items-center bg-wax px-1 text-[0.65rem] text-page">
                {count}
              </motion.span>
            </button>
            <button onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center border border-sepia lg:hidden" aria-label="Меню">
              ≡
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-[60] flex flex-col bg-page p-6 lg:hidden" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <button onClick={() => setMenu(false)} className="ml-auto grid h-11 w-11 place-items-center border border-sepia text-xl" aria-label="Закрыть">
              ×
            </button>
            <ul className="mt-10 space-y-4">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <a href={l.href} onClick={() => setMenu(false)} className="flex items-baseline gap-4 font-display text-4xl">
                    <span className="text-lg text-wax">{l.r}.</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Envelope({ className = 'h-4 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="22" height="16" />
      <path d="M1 1l11 9 11-9" />
    </svg>
  )
}
