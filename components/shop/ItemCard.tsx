'use client'

import { useState } from 'react'
import type { Item } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'
import { useShopI18n } from '@/lib/shop-i18n'
import { ShoppingCart, Wheat, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import { AddToCartSheet } from './AddToCartSheet'
import clsx from 'clsx'

export function ItemCard({ item }: { item: Item }) {
  const { t } = useShopI18n()
  const { items: cartItems } = useCart()
  const [imgIndex, setImgIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)

  const soldOut = item.quantity === 0
  const images = item.images.filter(Boolean)
  const hasMultiple = images.length > 1

  const inCart = cartItems.filter(i => i.id === item.id).reduce((sum, i) => sum + i.quantity, 0)
  const atMax = inCart >= item.quantity

  const prev = (e: React.MouseEvent) => { e.preventDefault(); setImgIndex(i => (i - 1 + images.length) % images.length) }
  const next = (e: React.MouseEvent) => { e.preventDefault(); setImgIndex(i => (i + 1) % images.length) }

  return (
    <>
      <div className={clsx('bg-white rounded-2xl border border-warm-border overflow-hidden flex flex-col shadow-sm', soldOut && 'opacity-70')}>
        {/* Image */}
        <div className="aspect-square bg-cream-100 relative flex items-center justify-center overflow-hidden">
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[imgIndex]} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Wheat size={32} className="text-brown-200" />
          )}

          {hasMultiple && (
            <>
              <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center">
                <ChevronLeft size={14} />
              </button>
              <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center">
                <ChevronRight size={14} />
              </button>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); setImgIndex(i) }}
                    className={clsx('w-1.5 h-1.5 rounded-full', i === imgIndex ? 'bg-white' : 'bg-white/50')} />
                ))}
              </div>
            </>
          )}

          {soldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{t('items.soldOut')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 flex flex-col gap-1.5 flex-1">
          <p className="text-xs font-semibold text-brown-800 leading-tight line-clamp-2">{item.name}</p>
          {item.description && (
            <p className="text-[11px] text-brown-400 line-clamp-2 leading-relaxed">{item.description}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {item.is_vegan && (
              <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                <Leaf size={8} /> {t('items.vegan')}
              </span>
            )}
            {item.can_buy_half && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-1.5 py-0.5">
                {t('items.half')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-1 gap-2">
            <span className="text-sm font-bold text-brown-700">₪{item.price}</span>
            <button
              onClick={() => setSheetOpen(true)}
              disabled={soldOut || atMax}
              className={clsx(
                'flex items-center gap-1 rounded-xl text-xs font-medium py-1.5 px-2.5 transition-colors flex-1 justify-center',
                soldOut || atMax
                  ? 'bg-brown-100 text-brown-300 cursor-not-allowed'
                  : 'bg-brown-700 text-cream-100 hover:bg-brown-800 active:scale-95'
              )}
            >
              <ShoppingCart size={12} />
              {atMax ? `מקס (${item.quantity})` : t('items.addToCart')}
            </button>
          </div>
        </div>
      </div>

      {sheetOpen && <AddToCartSheet item={item} onClose={() => setSheetOpen(false)} />}
    </>
  )
}
