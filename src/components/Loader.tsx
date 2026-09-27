import { motion } from 'motion/react'
import { useEffect } from 'react'
import { spec } from '../data/atlas'
import { WaxSeal } from './ui'

const DURATION = 2600

/** Заставка: кожаная обложка гербария открывается, внутри — засушенный образец */
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DURATION)
    const skip = () => onDone()
    window.addEventListener('pointerdown', skip)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-sepia"
      exit={{ opacity: 0, scale: 1.4 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{ perspective: 1600 }}
    >
      <div className="relative h-[62vmin] w-[46vmin]">
        {/* страница под обложкой */}
        <div className="absolute inset-0 grid place-items-center bg-page shadow-2xl">
          <div className="absolute inset-3 border border-umber/30" />
          <motion.img
            src={spec('anemone')}
            alt=""
            className="specimen w-[70%]"
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.p
            className="absolute bottom-[8%] font-mono text-[1.6vmin] uppercase tracking-[0.25em] text-umber"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Anemone coronaria · №8
          </motion.p>
        </div>

        {/* обложка */}
        <motion.div
          className="absolute inset-0 origin-left bg-wax shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -165 }}
          transition={{ delay: 0.7, duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="absolute inset-[6%] border border-ochre/50" />
          <div className="absolute inset-[8%] border border-ochre/25" />
          <div className="flex h-full flex-col items-center justify-center gap-[3vmin] text-center text-ochre">
            <span className="font-mono text-[1.5vmin] uppercase tracking-[0.4em]">herbarium</span>
            <span className="font-display text-[6vmin] leading-none">Гербарий</span>
            <WaxSeal className="h-[12vmin] w-[12vmin]" />
            <span className="font-mono text-[1.5vmin] uppercase tracking-[0.4em]">цветочная мастерская</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
