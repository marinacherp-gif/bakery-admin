'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  maxQuantity: number
  image: string | null
  canBuyHalf: boolean | null
  isHalf: boolean
}

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string; isHalf: boolean }
  | { type: 'INCREMENT'; id: string; isHalf: boolean }
  | { type: 'DECREMENT'; id: string; isHalf: boolean }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.items
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id && i.isHalf === action.item.isHalf)
      if (existing) {
        return state.map(i =>
          i.id === action.item.id && i.isHalf === action.item.isHalf
            ? { ...i, quantity: Math.min(i.quantity + action.item.quantity, i.maxQuantity) }
            : i
        )
      }
      return [...state, { ...action.item, quantity: Math.min(action.item.quantity, action.item.maxQuantity) }]
    }
    case 'REMOVE':
      return state.filter(i => !(i.id === action.id && i.isHalf === action.isHalf))
    case 'INCREMENT':
      return state.map(i =>
        i.id === action.id && i.isHalf === action.isHalf
          ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity) }
          : i
      )
    case 'DECREMENT':
      return state
        .map(i =>
          i.id === action.id && i.isHalf === action.isHalf ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (id: string, isHalf: boolean) => void
  increment: (id: string, isHalf: boolean) => void
  decrement: (id: string, isHalf: boolean) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shop_cart')
      if (stored) dispatch({ type: 'HYDRATE', items: JSON.parse(stored) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(items))
  }, [items])

  const total = items.reduce((sum, i) => sum + i.price * (i.isHalf ? 0.5 : 1) * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const addItem = (item: Omit<CartItem, 'quantity'>, qty = 1) =>
    dispatch({ type: 'ADD', item: { ...item, quantity: qty } })
  const removeItem = (id: string, isHalf: boolean) => dispatch({ type: 'REMOVE', id, isHalf })
  const increment = (id: string, isHalf: boolean) => dispatch({ type: 'INCREMENT', id, isHalf })
  const decrement = (id: string, isHalf: boolean) => dispatch({ type: 'DECREMENT', id, isHalf })
  const clear = () => dispatch({ type: 'CLEAR' })

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, increment, decrement, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
