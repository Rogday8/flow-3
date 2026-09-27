import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { atlas, spec } from '../data/atlas'
import { Btn, EASE } from './ui'

const RING = atlas.filter((s) => s.id !== 'cotton' && s.id !== 'strawflower' && s.id !== 'lupine').slice(0, 14)
const STEP = 360 / RING.length

/**
 * Первый экран: 3D-карусель образцов. Крутится сама, её можно тянуть мышкой или пальцем;
 * под каруселью — музейная этикетка того цветка, что сейчас впереди.
 */
export function Hero({ ready }: { ready: boolean }) {
  const rot = useMotionValue(0)
  const dragging = useRef(false)
  const idle = useRef(0)
  const [front, setFront] = useState(0)
  const s = RING[front]

  // медленное вращение, пока никто не трогает
  useAnimationFrame((_, delta) => {
    if (!ready || dragging.current) return
    if (performance.now() - idle.current < 2500) return
    rot.set(rot.get() - delta * 0.006)
  })

  useMotionValueEvent(rot, 'change', (r) => {
    const i = (((Math.round(-r / STEP) % RING.length) + RING.length) % RING.length)
    if (i !== front) setFront(i)
  })

  const tilt = useTransform(rot, (r) => Math.sin((r * Math.PI) / 180) * 2)

  const snap = () => {
    const target = Math.round(rot.get() / STEP) * STEP
    animate(rot, target, { type: 'spring', stiffness: 80, damping: 16 })
  }

  return (
    <section id="top" className="graph-paper aged relative min-h-[100svh] overflow-hidden bg-page pt-28">
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 text-center sm:px-8">
        <motion.p
          className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-umber"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Цветочная мастерская · основана в 2011 · Москва
        </motion.p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,6.6rem)] leading-[0.98] tracking-[-0.01em]">
          {['Цветы, собранные', 'как письма'].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i ? 'font-script text-wax' : ''}`}
                initial={{ y: '110%' }}
                animate={ready ? { y: '0%' } : {}}
                transition={{ duration: 1.2, delay: 0.25 + i * 0.12, ease: EASE }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* карусель */}
      <motion.div
        className="relative mx-auto -mt-6 h-[46vmin] min-h-[300px] w-full cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ perspective: 1400 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
        onPanStart={() => (dragging.current = true)}
        onPan={(_, info) => rot.set(rot.get() + info.delta.x * 0.25)}
        onPanEnd={() => {
          dragging.current = false
          idle.current = performance.now()
          snap()
        }}
      >
        <motion.div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d', rotateY: rot, rotateX: tilt }}>
          {RING.map((item, i) => (
            <div
              key={item.id}
              className="absolute left-0 top-0 grid h-[26vmin] min-h-[170px] w-[18vmin] min-w-[118px] -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(max(42vmin, 290px))`, backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 border border-umber/25 bg-page/90 shadow-[0_20px_40px_-20px_rgba(42,36,32,0.45)]" />
              <span className="absolute left-2 top-1.5 font-mono text-[0.6rem] text-umber">№{String(item.no).padStart(2, '0')}</span>
              <img src={spec(item.id)} alt={item.ru} draggable={false} className="specimen relative max-h-[78%] max-w-[82%] object-contain" />
              {/* полоска скотча */}
              <span className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-4deg] bg-ochre/35" />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* музейная этикетка */}
      <motion.div
        className="relative z-10 mx-auto mt-4 grid max-w-[1400px] gap-8 px-5 pb-10 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:items-end"
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.9, duration: 1, ease: EASE }}
      >
        <p className="max-w-sm text-umber">
          Мы собираем букеты так, как ботаники собирали гербарии: бережно, со смыслом и подписью. Каждый цветок в мастерской — в нашем атласе.
        </p>

        <div className="relative mx-auto w-[min(420px,100%)] border border-sepia bg-page p-5 text-left shadow-[6px_6px_0_rgba(42,36,32,0.9)]">
          <div className="flex items-start justify-between border-b border-dashed border-umber/40 pb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-umber">
            <span>образец №{String(s.no).padStart(2, '0')}</span>
            <span>{s.family}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p className="mt-3 font-display text-3xl">{s.ru}</p>
              <p className="font-mono text-sm italic text-wax">{s.latin}</p>
              <p className="mt-2 text-sm text-umber">
                на языке цветов — <span className="font-script text-xl text-sepia">{s.meaning}</span>
              </p>
            </motion.div>
          </AnimatePresence>
          {/* линейка */}
          <div className="mt-4 flex h-3 items-end justify-between border-t border-sepia">
            {Array.from({ length: 21 }, (_, i) => (
              <span key={i} className="w-px bg-sepia" style={{ height: i % 5 === 0 ? 12 : 6 }} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Btn href="#atlas">Открыть атлас</Btn>
          <Btn href="#message" variant="line">
            Послание
          </Btn>
        </div>
      </motion.div>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-umber/70 lg:block">
        ← потяните карусель →
      </p>
    </section>
  )
}
