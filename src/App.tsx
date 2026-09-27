import Lenis from 'lenis'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Album } from './components/Album'
import { Atlas } from './components/Atlas'
import { Cart } from './components/Cart'
import { Delivery } from './components/Delivery'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Letters } from './components/Letters'
import { Loader } from './components/Loader'
import { Message } from './components/Message'
import { Nav } from './components/Nav'
import { Postcard } from './components/Postcard'
import { Press } from './components/Press'
import { Ticker } from './components/ui'
import { atlas } from './data/atlas'
import { CartProvider, useCart } from './state/cart'

export default function App() {
  return (
    <CartProvider>
      <Site />
    </CartProvider>
  )
}

function Site() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  const { open } = useCart()
  useSmoothScroll(loading || open)

  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={!loading} />
        <LatinTicker />
        <Atlas />
        <Message />
        <Press />
        <Album />
        <Postcard />
        <Delivery />
        <Letters />
      </main>
      <Footer />
      <Cart />
    </>
  )
}

function LatinTicker() {
  return (
    <div className="border-y border-sepia bg-wax py-3 text-page">
      <Ticker>
        {atlas.map((s) => (
          <span key={s.id} className="flex items-center gap-6 px-6 font-display text-xl italic">
            {s.latin}
            <span className="font-mono text-xs not-italic text-ochre">№{String(s.no).padStart(2, '0')}</span>
          </span>
        ))}
      </Ticker>
    </div>
  )
}

/** Инерционный скролл; на время заставки и открытого конверта — стоп */
function useSmoothScroll(paused: boolean) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.2, smoothWheel: true, anchors: { offset: -70 } })
    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])
  useEffect(() => {
    if (!lenis) {
      document.body.style.overflow = paused ? 'hidden' : ''
      return
    }
    if (paused) lenis.stop()
    else lenis.start()
  }, [lenis, paused])
}
