import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { atlas, formatPrice, spec, type Specimen } from '../data/atlas'
import { useCart } from '../state/cart'
import { Chapter, EASE } from './ui'

const FILTERS = [
  { id: 'all', label: 'Все 20', test: () => true },
  { id: 'long', label: 'Стоят > недели', test: (s: Specimen) => s.vase >= 7 },
  { id: 'love', label: 'О любви', test: (s: Specimen) => s.feelings.includes('love') },
  { id: 'dry', label: 'Сухоцветы и суккуленты', test: (s: Specimen) => s.vase >= 30 },
  { id: 'aster', label: 'Астровые', test: (s: Specimen) => s.family === 'Asteraceae' },
] as const

/** Атлас: листы гербария, по клику — карточка образца с лупой */
export function Atlas() {
  const [f, setF] = useState<(typeof FILTERS)[number]['id']>('all')
  const [open, setOpen] = useState<Specimen | null>(null)
  const test = FILTERS.find((x) => x.id === f)!.test
  const list = atlas.filter(test)

  return (
    <section id="atlas" className="relative bg-parchment px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Chapter roman="I" label="атлас мастерской" title={['Двадцать образцов,', <span key="a" className="font-script text-wax">из которых всё начинается</span>]} />
          <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
            {FILTERS.map((x) => (
              <button
                key={x.id}
                onClick={() => setF(x.id)}
                className={`border px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors ${
                  f === x.id ? 'border-sepia bg-sepia text-page' : 'border-umber/30 text-umber hover:border-sepia hover:text-sepia'
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => (
              <motion.button
                layout
                key={s.id}
                onClick={() => setOpen(s)}
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: (i % 5) * 0.04, ease: EASE }}
                whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
                className="group relative flex aspect-[3/4] flex-col bg-page p-3 text-left shadow-[0_1px_0_rgba(42,36,32,0.15),0_14px_30px_-18px_rgba(42,36,32,0.5)]"
              >
                <span className="flex justify-between font-mono text-[0.6rem] uppercase text-umber">
                  <span>№{String(s.no).padStart(2, '0')}</span>
                  <span>{s.family}</span>
                </span>
                <span className="relative grid min-h-0 flex-1 place-items-center">
                  <img src={spec(s.id)} alt={s.ru} loading="lazy" className="specimen absolute inset-0 m-auto max-h-[88%] max-w-[88%] object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3" />
                  <span className="absolute left-[18%] top-[30%] h-3 w-10 rotate-[-28deg] bg-ochre/30" />
                  <span className="absolute bottom-[22%] right-[16%] h-3 w-10 rotate-[24deg] bg-ochre/30" />
                </span>
                {/* этикетка */}
                <span className="border border-umber/40 p-2">
                  <span className="block font-display text-base leading-tight">{s.ru}</span>
                  <span className="block truncate font-mono text-[0.62rem] italic text-wax">{s.latin}</span>
                  <span className="mt-1 flex justify-between font-mono text-[0.6rem] text-umber">
                    <span>{formatPrice(s.price)}/шт</span>
                    <span>{s.vase >= 30 ? '∞' : `${s.vase} дн.`}</span>
                  </span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{open && <Sheet s={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}

/** Карточка образца: лупа по наведению, шкалы стойкости и длины, покупка поштучно */
function Sheet({ s, onClose }: { s: Specimen; onClose: () => void }) {
  const [qty, setQty] = useState(5)
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const { add } = useCart()

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <motion.div className="fixed inset-0 z-[150] grid place-items-center bg-sepia/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto bg-page shadow-2xl md:grid-cols-[1.1fr_1fr]"
        initial={{ y: 60, rotateX: 12, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div
          ref={box}
          className="graph-paper relative grid aspect-square cursor-none place-items-center overflow-hidden bg-parchment"
          onPointerMove={(e) => {
            const r = box.current!.getBoundingClientRect()
            setLens({ x: e.clientX - r.left, y: e.clientY - r.top })
          }}
          onPointerLeave={() => setLens(null)}
        >
          <img src={spec(s.id)} alt={s.ru} className="specimen max-h-[78%] max-w-[78%] object-contain" />
          {lens && box.current && (
            // лупа ×2.5: внутри — увеличенная копия той же сцены, сдвинутая так, чтобы точка под курсором была в центре
            <div className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-sepia shadow-2xl" style={{ left: lens.x, top: lens.y }}>
              <div
                className="graph-paper absolute left-0 top-0 grid place-items-center bg-parchment"
                style={{
                  width: box.current.clientWidth,
                  height: box.current.clientHeight,
                  transformOrigin: '0 0',
                  transform: `translate(${80 - lens.x * 2.5}px, ${80 - lens.y * 2.5}px) scale(2.5)`,
                }}
              >
                <img src={spec(s.id)} alt="" className="max-h-[78%] max-w-[78%] object-contain" />
              </div>
            </div>
          )}
          <span className="absolute bottom-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-umber">наведите — это лупа</span>
        </div>

        <div className="flex flex-col p-7 sm:p-9">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-umber">образец №{String(s.no).padStart(2, '0')}</span>
            <button onClick={onClose} className="-mr-2 -mt-2 grid h-10 w-10 place-items-center text-2xl text-umber hover:text-wax" aria-label="Закрыть">
              ×
            </button>
          </div>
          <h3 className="mt-2 font-display text-4xl">{s.ru}</h3>
          <p className="font-mono text-sm italic text-wax">{s.latin}</p>
          <p className="mt-5 text-umber">{s.note}</p>

          <dl className="mt-6 space-y-3 font-mono text-xs">
            <Row k="Семейство" v={s.family} />
            <Row k="Сезон" v={s.season} />
            <Row k="Значение" v={<span className="font-script text-lg normal-case text-sepia">{s.meaning}</span>} />
            <Bar k="Стойкость" v={s.vase >= 30 ? 'годами' : `${s.vase} дней`} p={Math.min(1, s.vase / 10)} />
            <Bar k="Длина стебля" v={`${s.stem} см`} p={s.stem / 70} />
          </dl>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
            <div className="flex items-center border border-sepia">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 text-lg hover:bg-sepia hover:text-page" aria-label="Меньше">
                −
              </button>
              <span className="w-16 text-center font-mono text-sm">{qty} шт</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="h-11 w-11 text-lg hover:bg-sepia hover:text-page" aria-label="Больше">
                +
              </button>
            </div>
            <button
              onClick={() => {
                add({ key: `stem-${s.id}-${qty}`, title: `${s.ru} × ${qty}`, note: s.latin, price: s.price * qty, image: spec(s.id) })
                onClose()
              }}
              className="flex-1 bg-wax px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-page transition-colors hover:bg-sepia"
            >
              В конверт · {formatPrice(s.price * qty)}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-umber/30 pb-2 uppercase">
      <dt className="text-umber">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  )
}

function Bar({ k, v, p }: { k: string; v: string; p: number }) {
  return (
    <div className="border-b border-dashed border-umber/30 pb-2 uppercase">
      <div className="flex justify-between">
        <dt className="text-umber">{k}</dt>
        <dd>{v}</dd>
      </div>
      <div className="mt-2 h-1.5 bg-umber/15">
        <motion.div className="h-full bg-sage" initial={{ width: 0 }} animate={{ width: `${p * 100}%` }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} />
      </div>
    </div>
  )
}
