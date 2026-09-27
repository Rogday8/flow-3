import { motion } from 'motion/react'
import { useState } from 'react'
import { photo, spec, type PhotoName, type SpecName } from '../data/atlas'
import { useCart } from '../state/cart'
import { Chapter, WaxSeal } from './ui'

const FRONTS: { id: PhotoName; label: string }[] = [
  { id: 'letter-petals', label: 'Лепестки' },
  { id: 'lilac-branch', label: 'Сирень' },
  { id: 'magnolia-tree', label: 'Магнолии' },
  { id: 'meadow', label: 'Луг' },
  { id: 'rose-bed', label: 'Розы' },
]
const STAMPS: SpecName[] = ['camellia', 'iris', 'tulip', 'hellebore', 'osteospermum']
const PRICE = 190

/** Открытка к букету: лицевая сторона — фото, обратная — текст и марка. Переворачивается кликом. */
export function Postcard() {
  const [front, setFront] = useState(FRONTS[0].id)
  const [stamp, setStamp] = useState<SpecName>('camellia')
  const [text, setText] = useState('Пусть этот день будет таким же тёплым, как этот букет.')
  const [to, setTo] = useState('Маше')
  const [flipped, setFlipped] = useState(true)
  const { add } = useCart()

  return (
    <section id="card" className="relative overflow-hidden bg-page px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Chapter roman="IV" label="открытка от руки" title={['Несколько слов', <span key="c" className="font-script text-wax">к любому букету</span>]} />
          <p className="mt-6 max-w-md text-umber">Напишите текст — флорист перепишет его от руки чернилами на плотной бумаге и приклеит настоящую марку.</p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-umber">лицевая сторона</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {FRONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFront(f.id)
                      setFlipped(false)
                    }}
                    className={`h-14 w-20 overflow-hidden border-2 transition-all ${front === f.id ? 'border-wax' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    aria-label={f.label}
                  >
                    <img src={photo(f.id)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-umber">марка</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STAMPS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStamp(s)
                      setFlipped(true)
                    }}
                    className={`grid h-14 w-12 place-items-center border-2 border-dashed bg-parchment transition-all ${stamp === s ? 'border-wax' : 'border-umber/30'}`}
                  >
                    <img src={spec(s)} alt="" className="h-9 w-9 object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-umber">кому</span>
              <input value={to} onFocus={() => setFlipped(true)} onChange={(e) => setTo(e.target.value.slice(0, 24))} className="mt-2 w-full border-b border-umber/40 bg-transparent py-2 font-script text-2xl outline-none focus:border-wax" />
            </label>
            <label className="block">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-umber">текст · {text.length}/160</span>
              <textarea
                value={text}
                rows={3}
                onFocus={() => setFlipped(true)}
                onChange={(e) => setText(e.target.value.slice(0, 160))}
                className="mt-2 w-full resize-none border-b border-umber/40 bg-transparent py-2 font-script text-2xl leading-snug outline-none focus:border-wax"
              />
            </label>
            <button
              onClick={() => add({ key: `card-${front}-${stamp}-${to}-${text.length}`, title: `Открытка ${to ? `для ${to}` : ''}`, note: text, price: PRICE, image: photo(front) })}
              className="bg-wax px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-page hover:bg-sepia"
            >
              Добавить открытку · {PRICE} ₽
            </button>
          </div>
        </div>

        {/* сама открытка */}
        <div className="flex flex-col items-center" style={{ perspective: 1800 }}>
          <motion.button
            onClick={() => setFlipped((f) => !f)}
            className="relative aspect-[3/2] w-full max-w-[640px] cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0, rotateZ: flipped ? 1.5 : -1.5 }}
            transition={{ type: 'spring', stiffness: 60, damping: 13 }}
            aria-label="Перевернуть открытку"
          >
            {/* лицо */}
            <div className="absolute inset-0 overflow-hidden bg-page p-3 shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
              <img src={photo(front)} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-6 left-6 font-script text-4xl text-page drop-shadow-lg">с любовью</span>
            </div>
            {/* оборот */}
            <div className="aged absolute inset-0 grid grid-cols-[1.3fr_1fr] gap-5 bg-page p-6 text-left shadow-2xl sm:p-8" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="border-r border-umber/30 pr-5 font-script text-[clamp(1.1rem,2.3vw,1.8rem)] leading-snug text-sepia">{text || '…'}</p>
              <div className="flex flex-col">
                <div className="ml-auto grid h-24 w-20 place-items-center border-[3px] border-dotted border-umber/40 bg-parchment p-1">
                  <img src={spec(stamp)} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <WaxSeal className="-mt-6 ml-auto h-14 w-14 -rotate-12 opacity-90" />
                <div className="mt-auto space-y-3">
                  <p className="border-b border-umber/40 pb-1 font-script text-2xl">{to || ' '}</p>
                  <p className="border-b border-umber/40 pb-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-umber">лично в руки</p>
                  <p className="border-b border-umber/40 pb-1">&nbsp;</p>
                </div>
              </div>
            </div>
          </motion.button>
          <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-umber">нажмите на открытку, чтобы перевернуть</p>
        </div>
      </div>
    </section>
  )
}
