import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { albums, formatPrice, photo, spec } from '../data/atlas'
import { useCart } from '../state/cart'
import { Chapter, EASE } from './ui'

/** Альбом композиций: разворот книги, правая страница перелистывается в 3D */
export function Album() {
  const [[i, dir], setPage] = useState<[number, number]>([0, 1])
  const a = albums[i]
  const { add } = useCart()
  const go = (d: number) => setPage(([p]) => [(p + d + albums.length) % albums.length, d])

  return (
    <section id="album" className="graph-paper relative overflow-hidden bg-parchment px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Chapter roman="III" label="альбом композиций" title={['Готовые букеты,', <span key="b" className="font-script text-wax">страница за страницей</span>]} />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-umber">
            стр. {i + 1} из {albums.length}
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2" style={{ perspective: 2200 }}>
          {/* левая страница — фотография */}
          <div className="relative aspect-[4/5] overflow-hidden bg-page shadow-[inset_-30px_0_40px_-30px_rgba(42,36,32,0.35)] md:aspect-auto">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={a.id}
                src={photo(a.photo)}
                alt={a.title}
                className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </AnimatePresence>
          </div>

          {/* правая страница — перелистывается */}
          <div className="relative min-h-[520px] bg-page shadow-[inset_30px_0_40px_-30px_rgba(42,36,32,0.35)]" style={{ transformStyle: 'preserve-3d' }}>
            <PageContent key={a.id} a={a} onAdd={() => add({ key: `album-${a.id}`, title: a.title, note: a.text, price: a.price, image: photo(a.photo) })} />
            <Leaf key={`${a.id}-leaf`} dir={dir} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} className="border border-sepia px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-sepia hover:text-page">
            ← назад
          </button>
          <div className="flex gap-1.5">
            {albums.map((x, k) => (
              <button key={x.id} onClick={() => setPage([k, k > i ? 1 : -1])} className={`h-2 transition-all ${k === i ? 'w-8 bg-wax' : 'w-2 bg-umber/30'}`} aria-label={`Страница ${k + 1}`} />
            ))}
          </div>
          <button onClick={() => go(1)} className="border border-sepia px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-sepia hover:text-page">
            дальше →
          </button>
        </div>
      </div>
    </section>
  )
}

/** Лист, который переворачивается поверх страницы при смене разворота */
function Leaf({ dir }: { dir: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 bg-page"
      style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden', boxShadow: '0 0 60px rgba(42,36,32,0.25)' }}
      initial={{ rotateY: dir > 0 ? 0 : -180, opacity: 1 }}
      animate={{ rotateY: dir > 0 ? -180 : 0, opacity: dir > 0 ? 1 : 0 }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="absolute inset-4 border border-umber/20" />
    </motion.div>
  )
}

function PageContent({ a, onAdd }: { a: (typeof albums)[number]; onAdd: () => void }) {
  const [added, setAdded] = useState(false)
  return (
    <div className="relative flex h-full flex-col p-8 sm:p-12">
      <div className="absolute inset-4 border border-umber/25" />
      <span className="relative font-mono text-[0.65rem] uppercase tracking-[0.25em] text-umber">композиция</span>
      <h3 className="relative mt-3 font-display text-4xl sm:text-5xl">{a.title}</h3>
      <p className="relative mt-5 max-w-sm text-umber">{a.text}</p>
      <div className="relative mt-8 flex gap-3">
        {a.specs.map((s, k) => (
          <motion.img
            key={s}
            src={spec(s)}
            alt=""
            className="specimen h-24 w-24 object-contain"
            initial={{ opacity: 0, y: 14, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: k % 2 ? 6 : -6 }}
            transition={{ delay: 0.5 + k * 0.08 }}
          />
        ))}
      </div>
      <div className="relative mt-auto flex items-end justify-between gap-4 border-t border-dashed border-umber/40 pt-5">
        <span className="font-display text-3xl">{formatPrice(a.price)}</span>
        <button
          onClick={() => {
            onAdd()
            setAdded(true)
            window.setTimeout(() => setAdded(false), 1400)
          }}
          className="bg-wax px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-page transition-colors hover:bg-sepia"
        >
          {added ? '✓ в конверте' : 'в конверт'}
        </button>
      </div>
    </div>
  )
}
