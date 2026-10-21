import { motion } from 'motion/react'
import { atlas, photo, spec } from '../data/atlas'
import { Ticker, WaxSeal } from './ui'

/** Футер: почтовые марки из образцов, адрес мастерской, штамп */
export function Footer() {
  return (
    <footer id="contacts" className="relative overflow-hidden bg-sepia text-page">
      <div className="border-b border-page/10 py-6">
        <Ticker>
          {atlas.slice(0, 12).map((s) => (
            <span key={s.id} className="flex items-center gap-4 px-6">
              <span className="grid h-16 w-14 place-items-center border-[3px] border-dotted border-page/40 bg-page p-1">
                <img src={spec(s.id)} alt="" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="font-mono text-xs italic text-page/60">{s.latin}</span>
            </span>
          ))}
        </Ticker>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02]">
            Заходите
            <br />
            <span className="font-script text-ochre">на чашку чая</span>
          </p>
          <p className="mt-5 max-w-sm text-page/60">В мастерской пахнет эвкалиптом и старой бумагой. Можно полистать атлас вживую и собрать букет вместе с флористом.</p>
        </div>
        <div className="space-y-2 font-mono text-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ochre">Мастерская</p>
          <p>Москва, Хохловский пер., 7</p>
          <p>ежедневно 9:00 — 21:00</p>
          <a href="tel:+79990007777" className="block text-lg hover:text-ochre">
            +7 (999) 000-77-77
          </a>
          <a href="mailto:post@herbarium7.ru" className="block hover:text-ochre">
            post@herbarium7.ru
          </a>
        </div>
        <div className="relative">
          <motion.img
            src={photo('tea')}
            alt="Чай в мастерской"
            className="h-48 w-full object-cover grayscale-[0.3]"
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 2 }}
            viewport={{ once: true }}
          />
          <WaxSeal className="absolute -bottom-6 -left-6 h-20 w-20 -rotate-12" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-page/10 px-5 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-page/50 sm:flex-row sm:px-8">
        <span>
          © {new Date().getFullYear()} Гербарий №7 · сайт-концепт студии{' '}
          <a href="https://rogday8.github.io/mir-saitov/" target="_blank" rel="noreferrer" className="hover:text-ochre">«Мир сайтов»</a> · все права защищены
        </span>
        <a href="#top" className="hover:text-ochre">
          к началу ↑
        </a>
      </div>
    </footer>
  )
}
