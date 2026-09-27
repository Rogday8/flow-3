// Картинки подключаются через glob — Vite захеширует их при сборке
const specFiles = import.meta.glob<string>('../assets/spec/*.webp', { eager: true, import: 'default' })
const photoFiles = import.meta.glob<string>('../assets/photos/*.webp', { eager: true, import: 'default' })
const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([p, url]) => [p.split('/').pop()!.replace('.webp', ''), url]))
const specs = byName(specFiles)
const photos = byName(photoFiles)

export type SpecName =
  | 'cotton' | 'hellebore' | 'osteospermum' | 'nymphaea' | 'dahlia' | 'camellia' | 'daisy' | 'parrot-tulip'
  | 'iris' | 'strawflower' | 'tulip' | 'garden-rose' | 'hydrangea' | 'lupine' | 'aquilegia' | 'anemone'
  | 'lilac' | 'sunflower' | 'echeveria' | 'red-rose' | 'vase'

export type PhotoName =
  | 'astrantia-letter' | 'astrantia-vase' | 'book-coffee' | 'bouquet-behind' | 'camera-zinnia' | 'flatlay-nest'
  | 'gift-box' | 'greenhouse' | 'herbal-marigold' | 'hydrangea-card' | 'letter-ink' | 'letter-peony'
  | 'letter-petals' | 'letter-white' | 'lilac-branch' | 'lilac-coffee' | 'magnolia-tree' | 'market-book'
  | 'meadow' | 'peony-book' | 'peony-bouquet' | 'pink-interior' | 'plant-book' | 'postage' | 'red-roses'
  | 'rose-bed' | 'rose-books' | 'roses-box' | 'roses-field' | 'roses-vintage' | 'scissors-desk'
  | 'snapdragon-book' | 'spoon-petals' | 'stamps' | 'sunflower-jug' | 'sunflower-letters' | 'tea'
  | 'vintage-chair' | 'wildflower-book' | 'zinnias'

export const spec = (n: SpecName) => specs[n]
export const photo = (n: PhotoName) => photos[n]

export type Feeling = 'love' | 'thanks' | 'sorry' | 'joy' | 'hope' | 'miss' | 'admire' | 'friend'

export const feelings: { id: Feeling; label: string }[] = [
  { id: 'love', label: 'Люблю' },
  { id: 'thanks', label: 'Спасибо' },
  { id: 'sorry', label: 'Прости' },
  { id: 'joy', label: 'Радуюсь за тебя' },
  { id: 'hope', label: 'Всё будет хорошо' },
  { id: 'miss', label: 'Скучаю' },
  { id: 'admire', label: 'Восхищаюсь' },
  { id: 'friend', label: 'Ты мой друг' },
]

export type Specimen = {
  id: SpecName
  no: number
  ru: string
  latin: string
  family: string
  season: string
  vase: number // дней в вазе
  stem: number // см
  price: number // ₽ за стебель
  meaning: string
  feelings: Feeling[]
  note: string
}

/** Атлас: двадцать образцов с латинскими названиями и значением на языке цветов */
export const atlas: Specimen[] = [
  { id: 'garden-rose', no: 1, ru: 'Роза садовая', latin: 'Rosa × centifolia', family: 'Rosaceae', season: 'июнь — сентябрь', vase: 7, stem: 50, price: 390, meaning: 'нежная любовь', feelings: ['love', 'admire'], note: 'Пионовидная, с запахом старинного сада.' },
  { id: 'red-rose', no: 2, ru: 'Роза красная', latin: "Rosa 'Red Naomi'", family: 'Rosaceae', season: 'круглый год', vase: 10, stem: 70, price: 320, meaning: 'страсть', feelings: ['love'], note: 'Классика, которая никогда не выглядит банально.' },
  { id: 'camellia', no: 3, ru: 'Камелия', latin: 'Camellia japonica', family: 'Theaceae', season: 'январь — апрель', vase: 5, stem: 40, price: 480, meaning: 'восхищение', feelings: ['admire', 'love'], note: 'Любимый цветок Коко Шанель.' },
  { id: 'tulip', no: 4, ru: 'Тюльпан', latin: "Tulipa 'Ballerina'", family: 'Liliaceae', season: 'февраль — май', vase: 6, stem: 45, price: 180, meaning: 'признание', feelings: ['love', 'joy'], note: 'Продолжает расти в вазе — да, прямо в воде.' },
  { id: 'parrot-tulip', no: 5, ru: 'Тюльпан попугайный', latin: "Tulipa 'Rococo'", family: 'Liliaceae', season: 'март — май', vase: 6, stem: 45, price: 260, meaning: 'яркая радость', feelings: ['joy', 'friend'], note: 'Лепестки как перья — у каждого свой рисунок.' },
  { id: 'hydrangea', no: 6, ru: 'Гортензия', latin: 'Hydrangea macrophylla', family: 'Hydrangeaceae', season: 'июнь — октябрь', vase: 8, stem: 50, price: 590, meaning: 'благодарность', feelings: ['thanks'], note: 'Пьёт даже шапкой — брызгайте на соцветие.' },
  { id: 'iris', no: 7, ru: 'Ирис', latin: 'Iris versicolor', family: 'Iridaceae', season: 'апрель — июнь', vase: 5, stem: 60, price: 210, meaning: 'надежда', feelings: ['hope', 'friend'], note: 'Назван в честь богини радуги.' },
  { id: 'anemone', no: 8, ru: 'Анемон', latin: 'Anemone coronaria', family: 'Ranunculaceae', season: 'ноябрь — апрель', vase: 6, stem: 35, price: 240, meaning: 'ожидание', feelings: ['miss', 'hope'], note: 'Закрывается на ночь и снова раскрывается утром.' },
  { id: 'hellebore', no: 9, ru: 'Морозник', latin: 'Helleborus orientalis', family: 'Ranunculaceae', season: 'декабрь — март', vase: 9, stem: 30, price: 420, meaning: 'утешение', feelings: ['sorry', 'hope'], note: 'Цветёт из-под снега.' },
  { id: 'aquilegia', no: 10, ru: 'Аквилегия', latin: 'Aquilegia vulgaris', family: 'Ranunculaceae', season: 'май — июль', vase: 5, stem: 40, price: 270, meaning: 'робкое признание', feelings: ['sorry', 'love'], note: 'В народе — «орлик».' },
  { id: 'lilac', no: 11, ru: 'Сирень', latin: 'Syringa vulgaris', family: 'Oleaceae', season: 'май', vase: 5, stem: 50, price: 350, meaning: 'первая любовь', feelings: ['love', 'miss'], note: 'Найдите цветок с пятью лепестками — и загадайте.' },
  { id: 'lupine', no: 12, ru: 'Люпин', latin: 'Lupinus polyphyllus', family: 'Fabaceae', season: 'июнь — июль', vase: 5, stem: 60, price: 190, meaning: 'воображение', feelings: ['joy', 'admire'], note: 'Башенки распускаются снизу вверх.' },
  { id: 'dahlia', no: 13, ru: 'Георгин', latin: 'Dahlia pinnata', family: 'Asteraceae', season: 'июль — октябрь', vase: 5, stem: 45, price: 280, meaning: 'верность', feelings: ['friend', 'thanks'], note: 'Больше пятидесяти тысяч сортов.' },
  { id: 'osteospermum', no: 14, ru: 'Остеоспермум', latin: 'Osteospermum ecklonis', family: 'Asteraceae', season: 'май — сентябрь', vase: 6, stem: 30, price: 160, meaning: 'лёгкость', feelings: ['joy', 'friend'], note: 'Капская ромашка из Южной Африки.' },
  { id: 'daisy', no: 15, ru: 'Нивяник', latin: 'Leucanthemum vulgare', family: 'Asteraceae', season: 'июнь — август', vase: 7, stem: 50, price: 120, meaning: 'чистота', feelings: ['friend', 'hope'], note: 'Та самая ромашка «любит — не любит».' },
  { id: 'sunflower', no: 16, ru: 'Подсолнечник', latin: 'Helianthus annuus', family: 'Asteraceae', season: 'июль — сентябрь', vase: 8, stem: 70, price: 230, meaning: 'преданность', feelings: ['thanks', 'joy'], note: 'Юные цветки поворачиваются вслед за солнцем.' },
  { id: 'strawflower', no: 17, ru: 'Гелихризум', latin: 'Xerochrysum bracteatum', family: 'Asteraceae', season: 'круглый год (сухоцвет)', vase: 365, stem: 40, price: 150, meaning: 'вечная память', feelings: ['miss', 'thanks'], note: 'Шуршит, как бумага, и стоит годами.' },
  { id: 'nymphaea', no: 18, ru: 'Кувшинка', latin: 'Nymphaea alba', family: 'Nymphaeaceae', season: 'июль — август', vase: 3, stem: 20, price: 520, meaning: 'красноречие', feelings: ['admire'], note: 'Для плавающих композиций в широкой чаше.' },
  { id: 'echeveria', no: 19, ru: 'Эхеверия', latin: 'Echeveria elegans', family: 'Crassulaceae', season: 'круглый год', vase: 30, stem: 10, price: 290, meaning: 'стойкость', feelings: ['hope', 'friend'], note: 'Каменная роза — после букета её можно посадить.' },
  { id: 'cotton', no: 20, ru: 'Хлопок', latin: 'Gossypium hirsutum', family: 'Malvaceae', season: 'круглый год (сухоцвет)', vase: 365, stem: 60, price: 210, meaning: 'уют', feelings: ['thanks', 'sorry'], note: 'Лучший друг зимних букетов.' },
]

export const formatPrice = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽'

/** Готовые композиции для «альбома» */
export const albums: { id: string; title: string; text: string; price: number; photo: PhotoName; specs: SpecName[] }[] = [
  { id: 'letter', title: 'Письмо без слов', text: 'Белые пионы и астранция — для тех, кому трудно подобрать слова.', price: 5400, photo: 'letter-peony', specs: ['garden-rose', 'hellebore', 'cotton'] },
  { id: 'library', title: 'Библиотека', text: 'Розы, львиный зев и немного пыли старых книг. Для тех, кто читает.', price: 4700, photo: 'snapdragon-book', specs: ['garden-rose', 'aquilegia', 'lilac'] },
  { id: 'market', title: 'Воскресный рынок', text: 'Бархатцы, циннии, всё рыжее и тёплое. Для хорошего настроения.', price: 3900, photo: 'herbal-marigold', specs: ['sunflower', 'dahlia', 'strawflower'] },
  { id: 'hydra', title: 'Голубой конверт', text: 'Гортензия в крафте — для благодарности, которую не выразить открыткой.', price: 4200, photo: 'hydrangea-card', specs: ['hydrangea', 'iris', 'anemone'] },
  { id: 'crimson', title: 'Кармин', text: 'Двадцать пять красных роз в шляпной коробке. Без комментариев.', price: 8900, photo: 'roses-box', specs: ['red-rose', 'camellia'] },
  { id: 'lilac', title: 'Майское утро', text: 'Сирень и кофе на подоконнике. Букет, который пахнет детством.', price: 4400, photo: 'lilac-coffee', specs: ['lilac', 'anemone', 'daisy'] },
]
