import { motion, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { spec } from '../data/atlas'
import { useCart } from '../state/cart'
import { Btn, Chapter, useSectionProgress } from './ui'

const STEPS = [
  { t: 'Букет отцвёл', d: 'Через неделю-две вы пишете нам — курьер забирает букет бесплатно.' },
  { t: 'Прессуем', d: 'Мы разбираем его и сушим каждый цветок под прессом 14 дней.' },
  { t: 'Оформляем', d: 'Собираем гербарий в дубовой раме под стеклом, подписываем тушью.' },
  { t: 'Навсегда', d: 'Букет с вашей свадьбы или первого свидания — теперь на стене.' },
]

/** «Вечный букет»: на прокрутке цветок прижимается листом и становится гербарием */
export function Press() {
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref, ['start start', 'end end'])
  const sheetY = useTransform(p, [0.1, 0.45], ['-120%', '0%'])
  const sheetOpacity = useTransform(p, [0.1, 0.2, 0.55, 0.65], [0, 1, 1, 0])
  const flat = useTransform(p, [0.4, 0.5], [1, 0.92])
  const sat = useTransform(p, [0.4, 0.6], ['saturate(1) sepia(0)', 'saturate(0.75) sepia(0.25)'])
  const stamp = useTransform(p, [0.66, 0.72], [2.4, 1])
  const stampOpacity = useTransform(p, [0.66, 0.7], [0, 1])
  const frame = useTransform(p, [0.75, 0.9], [0, 1])
  const frameScale = useTransform(frame, [0, 1], [1.1, 1])
  const step = useTransform(p, [0, 0.3, 0.55, 0.8, 1], [0, 1, 2, 3, 3])
  const { add } = useCart()

  return (
    <section ref={ref} className="relative h-[320vh] bg-page">
      <div className="sticky top-0 grid h-[100svh] items-center overflow-hidden px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Chapter roman="✿" label="услуга мастерской" title={['Вечный букет', <span key="p" className="font-script text-wax">— гербарий на память</span>]} />
            <ol className="mt-8 space-y-4">
              {STEPS.map((s, i) => (
                <Step key={s.t} i={i} step={step} t={s.t} d={s.d} />
              ))}
            </ol>
            <div className="mt-8">
              <Btn onClick={() => add({ key: 'eternal', title: 'Вечный букет — гербарий в раме', note: 'забор букета, прессовка 14 дней, дубовая рама 30×40', price: 6900, image: spec('osteospermum') })}>
                Заказать · 6 900 ₽
              </Btn>
            </div>
          </div>

          <div className="relative mx-auto aspect-[3/4] w-[min(440px,80vw)]">
            {/* рама */}
            <motion.div className="absolute -inset-5 border-[14px] border-[#7a5a3c] shadow-2xl" style={{ opacity: frame, scale: frameScale }} />
            <div className="aged absolute inset-0 bg-parchment shadow-xl">
              <div className="absolute inset-4 border border-umber/25" />
            </div>
            <motion.img src={spec('osteospermum')} alt="Остеоспермум" className="specimen absolute left-1/2 top-[44%] w-[70%] -translate-x-1/2 -translate-y-1/2" style={{ scaleY: flat, filter: sat }} />
            {/* верхний лист пресса */}
            <motion.div className="absolute inset-0 bg-page shadow-[0_30px_60px_rgba(42,36,32,0.35)]" style={{ y: sheetY, opacity: sheetOpacity }}>
              <div className="graph-paper absolute inset-0 opacity-60" />
            </motion.div>
            {/* подпись и штамп */}
            <motion.div className="absolute inset-x-8 bottom-8 border border-umber/50 bg-page/80 p-3 font-mono text-[0.65rem] uppercase text-umber" style={{ opacity: stampOpacity }}>
              <span className="block font-display text-lg normal-case text-sepia">Osteospermum ecklonis</span>
              собрано 14.02 · засушено 28.02 · для А. и М.
            </motion.div>
            <motion.div className="absolute right-6 top-6 grid h-24 w-24 -rotate-12 place-items-center rounded-full border-[3px] border-wax text-center font-mono text-[0.6rem] uppercase leading-tight text-wax" style={{ scale: stamp, opacity: stampOpacity }}>
              гербарий
              <br />
              №7
              <br />
              ✿ 2026
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ i, step, t, d }: { i: number; step: MotionValue<number>; t: string; d: string }) {
  const opacity = useTransform(step, (v) => (Math.round(v) >= i ? 1 : 0.28))
  const x = useTransform(step, (v) => (Math.round(v) === i ? 10 : 0))
  return (
    <motion.li className="grid grid-cols-[auto_1fr] gap-4" style={{ opacity, x }}>
      <span className="font-display text-2xl text-wax">{['i', 'ii', 'iii', 'iv'][i]}.</span>
      <span>
        <span className="block font-display text-xl">{t}</span>
        <span className="text-sm text-umber">{d}</span>
      </span>
    </motion.li>
  )
}
