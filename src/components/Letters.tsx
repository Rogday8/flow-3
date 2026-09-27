import { motion } from 'motion/react'
import { useState } from 'react'
import { photo, type PhotoName } from '../data/atlas'
import { Chapter, WaxSeal } from './ui'

const LETTERS: { from: string; date: string; text: string; img: PhotoName }[] = [
  { from: 'Вера, Замоскворечье', date: '12 мая', text: 'Заказала «Послание» для бабушки, выбрала «спасибо» и «скучаю». Она прочитала расшифровку и позвонила мне впервые за месяц. Спасибо вам.', img: 'letter-ink' },
  { from: 'Артём, Пресня', date: '3 марта', text: 'Открытку переписали от руки чернилами, с настоящей маркой. Жена хранит её в книге. Букет давно отцвёл, а открытка — нет.', img: 'postage' },
  { from: 'Ольга, Сокольники', date: '19 июня', text: 'Смотрела атлас с лупой, как в детстве энциклопедию. Потом заказала пять морозников — ровно таких, как на листе.', img: 'wildflower-book' },
  { from: 'Кирилл, Арбат', date: '28 сентября', text: 'Курьер привёз ровно к тому времени, что показала карта. Фото вручения пришло через минуту. Я был в командировке — и всё равно был рядом.', img: 'letter-white' },
]

/** Отзывы как письма в конвертах: по наведению конверт открывается */
export function Letters() {
  return (
    <section className="relative overflow-hidden bg-page px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Chapter roman="VI" label="переписка" title={['Письма,', <span key="l" className="font-script text-wax">которые нам пишут</span>]} />
        <div className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {LETTERS.map((l, i) => (
            <Envelope key={l.from} l={l} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Envelope({ l, i }: { l: (typeof LETTERS)[number]; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      className="relative pt-44 [clip-path:inset(-400px_-40px_0_-40px)]"
      initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onTap={() => setOpen((o) => !o)}
      style={{ perspective: 1200 }}
    >
      {/* письмо, выезжающее из конверта */}
      <motion.div
        className="absolute inset-x-4 bottom-3 z-10 h-[250px] bg-parchment p-5 shadow-lg"
        initial={false}
        animate={{ y: open ? -170 : 60 }}
        transition={{ type: 'spring', stiffness: 110, damping: 16, delay: open ? 0.25 : 0 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-umber">{l.date}</p>
        <p className="mt-2 font-script text-[1.3rem] leading-snug">{l.text}</p>
        <p className="mt-3 font-mono text-[0.62rem] uppercase text-wax">— {l.from}</p>
      </motion.div>

      {/* корпус конверта */}
      <div className="relative z-20 h-52 bg-[#e3d6bd] shadow-[0_20px_40px_-20px_rgba(42,36,32,0.5)]">
        <div className="absolute inset-0 bg-[linear-gradient(155deg,transparent_49.5%,rgba(42,36,32,0.12)_50%,transparent_51%),linear-gradient(25deg,transparent_49.5%,rgba(42,36,32,0.12)_50%,transparent_51%)]" />
        <img src={photo(l.img)} alt="" className="absolute bottom-4 left-4 h-16 w-12 rotate-[-6deg] border-[3px] border-dotted border-page object-cover" />
        <p className="absolute bottom-5 right-5 font-script text-xl text-umber">{l.from.split(',')[0]}</p>
      </div>

      {/* клапан */}
      <motion.div
        className="absolute inset-x-0 top-44 z-30 h-28 origin-top"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: open ? 180 : 0, zIndex: open ? 5 : 30 }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="h-full bg-[#d9c9ab]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <motion.div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2" animate={{ opacity: open ? 0 : 1 }}>
          <WaxSeal className="h-14 w-14" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
