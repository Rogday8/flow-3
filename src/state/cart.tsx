import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartItem = { key: string; title: string; note: string; price: number; image: string; qty: number }

type CartApi = {
  items: CartItem[]
  count: number
  total: number
  open: boolean
  pulse: number
  setOpen: (v: boolean) => void
  add: (item: Omit<CartItem, 'qty'>) => void
  change: (key: string, delta: number) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)
const KEY = 'herbarium7-cart'

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* приватный режим — не сохраняем */
    }
  }, [items])

  const add = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) =>
      prev.some((i) => i.key === item.key) ? prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + 1 } : i)) : [...prev, { ...item, qty: 1 }],
    )
    setPulse((p) => p + 1)
  }, [])

  const change = useCallback((key: string, delta: number) => {
    setItems((prev) => prev.flatMap((i) => (i.key !== key ? [i] : i.qty + delta <= 0 ? [] : [{ ...i, qty: i.qty + delta }])))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartApi>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      open,
      pulse,
      setOpen,
      add,
      change,
      clear,
    }),
    [items, open, pulse, add, change, clear],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart вне CartProvider')
  return ctx
}
