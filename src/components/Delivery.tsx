import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { Chapter, EASE } from './ui'

const ZONES = [
  { id: 'c', name: 'Центр', hint: 'внутри Садового кольца', r: 70, time: 45, price: 0, point: [255, 265] },
  { id: 't', name: 'До ТТК', hint: 'Хамовники, Басманный, Пресня', r: 125, time: 60, price: 290, point: [385, 220] },
  { id: 'm', name: 'До МКАД', hint: 'все районы внутри кольца', r: 190, time: 90, price: 490, point: [170, 420] },
  { id: 'o', name: 'За МКАД', hint: 'до 10 км от кольца', r: 245, time: 120, price: 790, point: [470, 455] },
] as const

const C = 300

/** Доставка: гравюрная карта с кольцами, курьер едет к выбранной зоне */
export function Delivery() {
  const [z, setZ] = useState<(typeof ZONES)[number]>(ZONES[1])
  const [x, y] = z.point
  const qx = (C + x) / 2 + 40
  const qy = (C + y) / 2 - 50
  const route = `M${C} ${C} Q ${qx} ${qy} ${x} ${y}`

  return (
    <section id="delivery" className="relative overflow-hidden bg-parchment px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Chapter roman="V" label="доставка" title={['Карта', <span key="d" className="font-script text-wax">наших курьеров</span>]} />
          <p className="mt-6 max-w-md text-umber">Выберите зону на карте — покажем, сколько ехать и сколько стоит. Везём в термобоксе, вручаем лично в руки, присылаем фото вручения.</p>

          <ul className="mt-10 border-t border-sepia">
            {ZONES.map((zone) => (
              <li key={zone.id}>
                <button
                  onClick={() => setZ(zone)}
                  className={`flex w-full items-center justify-between gap-4 border-b border-sepia/20 py-4 text-left transition-colors ${z.id === zone.id ? 'text-wax' : 'hover:text-wax'}`}
                >
                  <span>
                    <span className="block font-display text-2xl">{zone.name}</span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-umber">{zone.hint}</span>
                  </span>
                  <span className="text-right font-mono text-sm">
                    ~{zone.time} мин
                    <br />
                    <span className="text-umber">{zone.price ? `${zone.price} ₽` : 'бесплатно'}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <svg viewBox="0 0 600 600" className="w-full">
            <defs>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#5a4a3c" strokeOpacity="0.18" strokeWidth="1" />
              </pattern>
            </defs>
            {/* зоны */}
            {[...ZONES].reverse().map((zone) => (
              <circle
                key={zone.id}
                cx={C}
                cy={C}
                r={zone.r}
                onClick={() => setZ(zone)}
                className="cursor-pointer transition-all duration-500"
                fill={z.id === zone.id ? 'rgba(107,30,42,0.12)' : zone.id === 'o' ? 'url(#hatch)' : 'rgba(247,242,231,0.6)'}
                stroke="#2a2420"
                strokeOpacity={z.id === zone.id ? 0.9 : 0.35}
                strokeWidth={z.id === zone.id ? 2 : 1}
                strokeDasharray={zone.id === 'o' ? '6 5' : undefined}
              />
            ))}
            {/* река */}
            <path d="M40 180 C 140 150, 190 260, 280 240 S 400 330, 470 300 S 560 360, 590 330" fill="none" stroke="#4f6a86" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" />
            <path d="M40 180 C 140 150, 190 260, 280 240 S 400 330, 470 300 S 560 360, 590 330" fill="none" stroke="#efe8da" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="2 8" />
            {/* улицы-лучи */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2 + 0.2
              return <line key={i} x1={C + Math.cos(a) * 30} y1={C + Math.sin(a) * 30} x2={C + Math.cos(a) * 260} y2={C + Math.sin(a) * 260} stroke="#2a2420" strokeOpacity="0.12" />
            })}
            {/* маршрут */}
            <motion.path key={z.id} d={route} fill="none" stroke="#6b1e2a" strokeWidth="2.5" strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
            <Courier key={`${z.id}-dot`} q={[qx, qy]} to={[x, y]} />
            {/* мастерская */}
            <circle cx={C} cy={C} r="12" fill="#2a2420" />
            <text x={C} y={C + 4} textAnchor="middle" fontSize="11" fill="#efe8da" fontFamily="Prata, serif">
              №7
            </text>
            <text x={C + 18} y={C + 30} fontSize="12" fill="#2a2420" fontFamily="IBM Plex Mono, monospace">
              мастерская
            </text>
            {/* роза ветров */}
            <g transform="translate(535 70)" fill="#2a2420" fontFamily="Prata, serif" fontSize="12">
              <path d="M0 -26 L5 0 L0 26 L-5 0Z" fillOpacity="0.8" />
              <path d="M-26 0 L0 5 L26 0 L0 -5Z" fillOpacity="0.4" />
              <text y="-32" textAnchor="middle">С</text>
            </g>
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 10, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-2 border border-sepia bg-page px-5 py-3 shadow-[4px_4px_0_rgba(42,36,32,0.85)] sm:bottom-6 sm:left-6"
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-umber">{z.name}</p>
              <p className="font-display text-3xl">~{z.time} минут</p>
              <p className="font-script text-xl text-wax">{z.price ? `доставка ${z.price} ₽` : 'доставка бесплатно'}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/** Точка-курьер едет по той же квадратичной кривой, что и пунктир маршрута */
function Courier({ q, to }: { q: [number, number]; to: readonly [number, number] }) {
  const t = useMotionValue(0)
  useEffect(() => {
    const c = animate(t, 1, { duration: 1.6, ease: EASE })
    return () => c.stop()
  }, [t])
  const bez = (a: number, b: number, c: number, v: number) => (1 - v) * (1 - v) * a + 2 * (1 - v) * v * b + v * v * c
  const cx = useTransform(t, (v) => bez(C, q[0], to[0], v))
  const cy = useTransform(t, (v) => bez(C, q[1], to[1], v))
  return <motion.circle r="7" fill="#6b1e2a" stroke="#f7f2e7" strokeWidth="2" style={{ cx, cy }} />
}
