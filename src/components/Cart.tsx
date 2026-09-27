import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { formatPrice } from '../data/atlas'
import { useCart } from '../state/cart'
import { Envelope } from './Nav'
import { WaxSeal } from './ui'

/** Корзина-конверт: выезжает снизу, при заказе конверт запечатывается сургучом */
export function Cart() {
  const { items, total, open, setOpen, change, clear } = useCart()
  const [step, setStep] = useState<'list' | 'form' | 'sealed'>('list')

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    if (step === 'sealed') window.setTimeout(() => setStep('list'), 600)
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    clear()
    setStep('sealed')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[120] bg-sepia/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            role="dialog"
            aria-label="Конверт с заказом"
            className="fixed inset-x-0 bottom-0 z-[130] mx-auto flex max-h-[88svh] w-full max-w-2xl flex-col bg-page shadow-[0_-30px_80px_rgba(42,36,32,0.4)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* клапан конверта */}
            <div className="relative h-14 shrink-0 bg-[#e3d6bd]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
            <button onClick={close} className="absolute right-4 top-3 z-10 grid h-9 w-9 place-items-center text-2xl text-umber hover:text-wax" aria-label="Закрыть">
              ×
            </button>

            {step === 'sealed' ? (
              <div className="flex flex-col items-center px-8 pb-12 pt-4 text-center">
                <motion.div initial={{ scale: 3, rotate: -40, opacity: 0 }} animate={{ scale: 1, rotate: -12, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}>
                  <WaxSeal className="h-28 w-28" />
                </motion.div>
                <p className="mt-6 font-display text-3xl">Конверт запечатан</p>
                <p className="mt-2 font-script text-2xl text-umber">мы позвоним, чтобы уточнить детали</p>
                <button onClick={close} className="mt-8 bg-sepia px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-page">
                  Благодарю
                </button>
              </div>
            ) : !items.length ? (
              <div className="flex flex-col items-center px-8 pb-12 pt-4 text-center">
                <Envelope className="h-12 w-16 text-umber/50" />
                <p className="mt-5 font-display text-2xl">Конверт пуст</p>
                <p className="mt-1 font-script text-xl text-umber">загляните в атлас или напишите послание</p>
                <a href="#atlas" onClick={close} className="mt-6 border border-sepia px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-sepia hover:text-page">
                  Открыть атлас
                </a>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 sm:px-10">
                <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.3em] text-umber">{step === 'list' ? 'содержимое конверта' : 'куда доставить'}</p>
                {step === 'list' ? (
                  <ul className="mt-4 min-h-0 flex-1 divide-y divide-dashed divide-umber/30 overflow-y-auto" data-lenis-prevent>
                    {items.map((it) => (
                      <li key={it.key} className="flex items-center gap-4 py-3">
                        <img src={it.image} alt="" className="h-14 w-14 shrink-0 bg-parchment object-contain p-1" />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg leading-tight">{it.title}</p>
                          <p className="truncate text-xs text-umber">{it.note}</p>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <button onClick={() => change(it.key, -1)} className="h-6 w-6 border border-umber/40" aria-label="Меньше">
                            −
                          </button>
                          {it.qty}
                          <button onClick={() => change(it.key, 1)} className="h-6 w-6 border border-umber/40" aria-label="Больше">
                            +
                          </button>
                        </div>
                        <span className="w-24 text-right font-mono text-sm">{formatPrice(it.price * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <form id="order" onSubmit={submit} className="mt-4 grid min-h-0 flex-1 gap-4 overflow-y-auto sm:grid-cols-2" data-lenis-prevent>
                    {[
                      ['Имя', 'name', 'text'],
                      ['Телефон', 'phone', 'tel'],
                      ['Адрес', 'address', 'text'],
                      ['Дата и время', 'when', 'datetime-local'],
                    ].map(([l, n, t]) => (
                      <label key={n} className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-umber">
                        {l}
                        <input required name={n} type={t} className="mt-1 w-full border-b border-umber/40 bg-transparent py-2 font-sans text-base normal-case tracking-normal text-sepia outline-none focus:border-wax" />
                      </label>
                    ))}
                  </form>
                )}
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-sepia pt-4">
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-umber">итого</p>
                    <p className="font-display text-3xl">{formatPrice(total)}</p>
                  </div>
                  <div className="flex gap-2">
                    {step === 'form' && (
                      <button onClick={() => setStep('list')} className="border border-sepia px-4 py-3.5 font-mono text-xs uppercase">
                        ←
                      </button>
                    )}
                    {step === 'list' ? (
                      <button onClick={() => setStep('form')} className="bg-wax px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-page hover:bg-sepia">
                        Оформить →
                      </button>
                    ) : (
                      <button form="order" className="bg-wax px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-page hover:bg-sepia">
                        Запечатать заказ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
