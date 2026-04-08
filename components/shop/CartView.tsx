'use client'

import { useCart } from '@/lib/cart-context'
import { useShopI18n } from '@/lib/shop-i18n'
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function CartView({ phone }: { phone: string | null }) {
  const { items, total, itemCount, increment, decrement, removeItem, clear } = useCart()
  const { t } = useShopI18n()

  const buildOrderText = () => {
    const lines = items.map(i => {
      const lineTotal = (i.price * (i.isHalf ? 0.5 : 1) * i.quantity).toFixed(0)
      return `${i.name}${i.isHalf ? ' (חצי)' : ''} × ${i.quantity} = ₪${lineTotal}`
    })
    return `הזמנה חדשה:\n${lines.join('\n')}\n\nסה״כ: ₪${total.toFixed(0)}`
  }

  const whatsappHref = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(buildOrderText())}`
    : '#'

  const toBitPhone = (p: string) => {
    const digits = p.replace(/[^0-9]/g, '')
    // Convert 972XXXXXXXXX → 0XXXXXXXXX (local Israeli format Bit expects)
    return digits.startsWith('972') ? '0' + digits.slice(3) : digits
  }

  const bitHref = phone
    ? `https://www.bitpay.co.il/app/pay?phone=${toBitPhone(phone)}&sum=${total.toFixed(0)}&details=${encodeURIComponent('הזמנה מלאבריד')}`
    : '#'

  if (itemCount === 0) {
    return (
      <div dir="rtl" className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <ShoppingCart size={56} className="text-brown-200 mb-4" strokeWidth={1} />
        <h2 className="text-lg font-semibold text-brown-700 mb-1">{t('cart.empty')}</h2>
        <p className="text-sm text-brown-400 mb-6">{t('cart.emptyDesc')}</p>
        <Link
          href="/shop"
          className="bg-brown-700 text-cream-100 rounded-xl px-6 py-2.5 text-sm font-medium"
        >
          לחנות
        </Link>
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h1 className="text-lg font-bold text-brown-800">{t('cart.title')}</h1>
        <button onClick={clear} className="text-xs text-brown-400 underline">
          {t('cart.clear')}
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 pb-4 flex flex-col gap-3">
        {items.map(item => {
          const linePrice = item.price * (item.isHalf ? 0.5 : 1)
          return (
            <div key={`${item.id}-${item.isHalf}`} className="bg-white rounded-2xl border border-warm-border p-3 flex gap-3">
              {/* Image */}
              <div className="w-14 h-14 rounded-xl bg-cream-100 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart size={20} className="text-brown-200" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brown-800 leading-tight truncate">{item.name}</p>
                {item.isHalf && <p className="text-xs text-amber-600">{t('cart.half')}</p>}
                <p className="text-xs text-brown-500 mt-0.5">
                  ₪{linePrice.toFixed(0)} × {item.quantity} ={' '}
                  <span className="font-semibold text-brown-700">₪{(linePrice * item.quantity).toFixed(0)}</span>
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <button
                  onClick={() => removeItem(item.id, item.isHalf)}
                  className="text-brown-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decrement(item.id, item.isHalf)}
                    className="w-7 h-7 rounded-full bg-cream-100 flex items-center justify-center text-brown-600 hover:bg-cream-200"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-semibold text-brown-800 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increment(item.id, item.isHalf)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-brown-700 text-cream-100 hover:bg-brown-800"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky total */}
      <div className="sticky bottom-16 z-30 bg-white border-t border-warm-border px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-brown-700">{t('cart.total')}</span>
          <span className="text-xl font-bold text-brown-800">₪{total.toFixed(0)}</span>
        </div>
        <a
          href={bitHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-white rounded-2xl py-3.5 font-semibold text-base w-full transition-colors mb-2"
          style={{ backgroundColor: '#00A4E4' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bit-logo.png" alt="Bit" className="h-5 w-auto" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          שלם עם Bit
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3.5 font-semibold text-base w-full transition-colors"
        >
          <MessageCircle size={20} />
          {t('cart.order')}
        </a>
      </div>
    </div>
  )
}
