import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { atlas, feelings, formatPrice, spec, type Feeling } from '../data/atlas'
import { useCart } from '../state/cart'
import { Chapter, EASE } from './ui'

const STEMS_EACH = 3
const WRAP = 450

/** Раскладка засушенных образцов на листе: [x%, y%, поворот°] */
const SPOTS: [number, number, number][] = [
  [50, 40, -4],
  [29, 45, -18],
  [71, 43, 16],
  [38, 27, -8],
  [63, 27, 10],
]

/** «Послание»: выбранные чувства переводятся на язык цветов */
export function Message() {
  const [picked, setPicked] = useState<Feeling[]>(['love', 'thanks'])
  const [name, setName] = useState('')
  const { add, setOpen } = useCart()

  const flowers = useMemo(() => {
    if (!picked.length) return []
    return atlas
      .map((s) => ({ s, score: s.feelings.filter((f) => picked.includes(f)).length * 10 - (s.vase >= 30 ? 3 : 0) + (s.no % 3) }))
      .filter((x) => x.score >= 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.s)
  }, [picked])

  const total = flowers.reduce((sum, f) => sum + f.price * STEMS_EACH, 0) + (flowers.length ? WRAP : 0)
  const letter = useMemo(() => {
    const who = name.trim() || 'тебе'
    const words = picked.map((p) => feelings.find((f) => f.id === p)!.label.toLowerCase())
    return words.length ? `Дорогой(ая) ${who}, этот букет говорит: ${words.join(', ')}.` : 'Выберите, что хотите сказать…'
  }, [picked, name])

  const toggle = (f: Feeling) => setPicked((p) => (p.includes(f) ? p.filter((x) => x !== f) : p.length >= 3 ? [...p.slice(1), f] : [...p, f]))

  return (
    <section id="message" className="relative overflow-hidden bg-sepia px-5 py-24 text-page sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Chapter dark roman="II" label="язык цветов" title={['Скажите это', <span key="m" className="font-script text-ochre">цветами</span>]} />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-page/60">1 · что вы хотите сказать (до трёх)</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {feelings.map((f) => {
                const on = picked.includes(f.id)
                return (
                  <motion.button
                    key={f.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggle(f.id)}
                    className={`border px-4 py-2.5 text-sm transition-colors ${on ? 'border-ochre bg-ochre text-sepia' : 'border-page/25 text-page/80 hover:border-page'}`}
                  >
                    {on ? '✓ ' : ''}
                    {f.label}
                  </motion.button>
                )
              })}
            </div>

            <label className="mt-10 block">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-page/60">2 · кому</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 30))}
                placeholder="Имя получателя"
                className="mt-3 w-full border-b border-page/30 bg-transparent py-3 font-script text-3xl text-page outline-none placeholder:text-page/25 focus:border-ochre"
              />
            </label>

            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-page/60">3 · расшифровка</p>
              <ul className="mt-4 space-y-2">
                <AnimatePresence initial={false}>
                  {flowers.map((f) => (
                    <motion.li
                      key={f.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 border-b border-dashed border-page/15 pb-2 font-mono text-sm"
                    >
                      <img src={spec(f.id)} alt="" className="h-9 w-9 object-contain" />
                      <span className="flex-1">
                        {f.ru} <span className="text-page/40">×{STEMS_EACH}</span>
                      </span>
                      <span className="font-script text-xl text-ochre">{f.meaning}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>

          {/* лист с композицией и письмом */}
          <div className="relative">
            <div className="aged relative aspect-[4/5] overflow-hidden bg-page text-sepia shadow-2xl sm:aspect-[5/5]">
              <div className="absolute inset-4 border border-umber/30" />
              <span className="absolute left-7 top-6 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-umber">послание · лист {picked.length || '—'}</span>
              <AnimatePresence>
                {flowers.map((f, i) => {
                  const [x, y, r] = SPOTS[i]
                  return (
                    <motion.img
                      key={f.id}
                      src={spec(f.id)}
                      alt={f.ru}
                      className="specimen absolute max-h-[34%] w-[30%] -translate-x-1/2 -translate-y-1/2 object-contain"
                      style={{ left: `${x}%`, top: `${y}%`, zIndex: 10 - i }}
                      initial={{ opacity: 0, scale: 1.4, rotate: r + 30, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, scale: 1, rotate: r, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.7, rotate: r - 30 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  )
                })}
              </AnimatePresence>
              <div className="absolute inset-x-7 bottom-7">
                <Typewriter text={letter} />
                <div className="mt-4 flex items-end justify-between border-t border-dashed border-umber/40 pt-3 font-mono text-xs">
                  <span className="text-umber">
                    {flowers.length * STEMS_EACH} стеблей · крафт и лента
                  </span>
                  <span className="font-display text-2xl">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <button
              disabled={!flowers.length}
              onClick={() => {
                add({
                  key: `msg-${flowers.map((f) => f.id).join('-')}`,
                  title: `Послание${name ? ` для ${name}` : ''}`,
                  note: flowers.map((f) => `${f.ru} — ${f.meaning}`).join('; '),
                  price: total,
                  image: spec(flowers[0].id),
                })
                setOpen(true)
              }}
              className="mt-5 w-full bg-ochre py-4 font-mono text-xs uppercase tracking-[0.2em] text-sepia transition-colors hover:bg-page disabled:opacity-40"
            >
              Запечатать послание в конверт →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Текст печатается, как на машинке */
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const t = window.setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 28)
    return () => window.clearInterval(t)
  }, [text])
  return (
    <p className="min-h-[3.2em] font-script text-2xl leading-snug sm:text-3xl">
      {text.slice(0, n)}
      <span className="animate-pulse text-wax">|</span>
    </p>
  )
}
